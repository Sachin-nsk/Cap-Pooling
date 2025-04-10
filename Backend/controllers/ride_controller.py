from flask import Blueprint, request, jsonify, current_app as app
from extensions import mongo, mail
from models.ride_model import create_ride
from bson import ObjectId
from utils.getCordinates import get_coordinates
from utils.predict_cost import predict_ride_cost  # Import ML prediction function
from geopy.distance import geodesic
import geocoder
from flask_mail import Message
ride_bp = Blueprint('ride', __name__, url_prefix='/ride')

# Emission factors (kg CO2 per km) based on car type
EMISSION_FACTORS = {
    "sedan": 0.192,
    "hatchback": 0.171,
    "suv": 0.222,
    "muv": 0.210
}

# Get all rides
@ride_bp.route('/all', methods=['GET'])
def get_all_rides():
    rides = list(mongo.db.rides.find())
    for ride in rides:
        ride["_id"] = str(ride["_id"])
    return jsonify(rides), 200


# Get ride by driver id
@ride_bp.route('/driver/<driver_id>', methods=['GET'])
def get_ride_by_driver(driver_id):
    ride = mongo.db.rides.find_one({"driver_id": str(driver_id)})
    if not ride:
        return jsonify({"message": "Ride not found"}), 404

    ride["_id"] = str(ride["_id"])
    return jsonify(ride), 200


# Search for rides for a passenger
@ride_bp.route('/passenger/<passenger_id>', methods=['GET'])
def search_rides(passenger_id):
    print(passenger_id)
    passenger = mongo.db.passenger.find_one({"user_id": str(passenger_id)})

    if not passenger:
        return jsonify({"message": "Passenger not found"}), 404

    preferred_car_type = passenger["preferred_car_type"].lower()
    from_coordinates = [
        passenger["from_coordinates"]["latitude"],
        passenger["from_coordinates"]["longitude"]
    ]
    to_coordinates = [
        passenger["to_coordinates"]["latitude"],
        passenger["to_coordinates"]["longitude"]
    ]
    print(preferred_car_type)
    rides = list(mongo.db.rides.find({
        "car_type": preferred_car_type,
        "no_of_passengers_can_be_taken": {"$gt": 0},
    }))
    #print(rides)
    matched_rides = []

    for ride in rides:
        ride_from = [ride["from_coordinates"]["latitude"], ride["from_coordinates"]["longitude"]]
        ride_to = [ride["to_coordinates"]["latitude"], ride["to_coordinates"]["longitude"]]

        if (
            min(ride_from[0], ride_to[0]) <= from_coordinates[0] <= max(ride_from[0], ride_to[0])
            and min(ride_from[1], ride_to[1]) <= from_coordinates[1] <= max(ride_from[1], ride_to[1])
        ):
            ride["_id"] = str(ride["_id"])
            matched_rides.append(ride)

    return jsonify(matched_rides), 200

@ride_bp.route('/book/<passenger_id>/<driver_id>', methods=['POST'])
def book_ride(passenger_id, driver_id):
    # Check if passenger exists
    print("Booking ride...")
    print(passenger_id, driver_id)
    passenger = mongo.db.passenger.find_one({"user_id": str(passenger_id)})
    print(passenger)
    if not passenger:
        return jsonify({"message": "Passenger not found"}), 404

    # Check if ride exists
    ride = mongo.db.rides.find_one({"driver_id": str(driver_id)})
    if not ride:
        return jsonify({"message": "Ride not found"}), 404

    # Update passenger collection
    mongo.db.passenger.update_one(
        {"user_id": str(passenger_id)},
        {
            #"$inc": {"rides_as_passenger": 1},
            "$push": {"rides": {"driver_id": driver_id}}
        }
    )

    # Update rides collection
    mongo.db.rides.update_one(
        {"driver_id": str(driver_id)},
        {
            "$inc": {"no_of_passengers_can_be_taken": -1},
            "$push": {"users": passenger_id}
        }
    )

    return jsonify({"message": "Ride booked successfully"}), 200


# Predict cost of ride
@ride_bp.route('/predict-cost/<driver_id>', methods=['GET'])
def predict_ride_cost_api(driver_id):
    try:
        ride = mongo.db.rides.find_one({"driver_id": str(driver_id)})
        #print(ride)
        if not ride:
            return jsonify({"error": "Ride not found"}), 404

        coordinates = []

        driver_start = (
            ride['from_coordinates']['latitude'],
            ride['from_coordinates']['longitude']
        )
        driver_end = (
            ride['to_coordinates']['latitude'],
            ride['to_coordinates']['longitude']
        )

        passengers = []
        #print(ride['users'])
        for user in ride['users']:
            passenger = mongo.db.passenger.find_one({"user_id": user})
            if not passenger:
                continue  # skip if passenger not found

            start = (
                passenger['from_coordinates']['latitude'],
                passenger['from_coordinates']['longitude']
            )
            end = (
                passenger['to_coordinates']['latitude'],
                passenger['to_coordinates']['longitude']
            )

            passengers.append({'start': start, 'end': end})

        prediction_df = predict_ride_cost(driver_start, driver_end, passengers)
        #print(prediction_df)
        return jsonify({"data": prediction_df}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@ride_bp.route('/carbon-footprint/<user_id>', methods=['GET'])
def calculate_carbon_footprint(user_id):
    passenger = mongo.db.passenger.find_one({"user_id": str(user_id)})

    if not passenger:
        return jsonify({"message": "Passenger not found"}), 404

    from_coordinates = (
        passenger["from_coordinates"]["latitude"],
        passenger["from_coordinates"]["longitude"]
    )

    to_coordinates = (
        passenger["to_coordinates"]["latitude"],
        passenger["to_coordinates"]["longitude"]
    )

    car_type = passenger["preferred_car_type"]

    distance = geodesic(from_coordinates, to_coordinates).km

    emission_factor = EMISSION_FACTORS.get(car_type.lower(), 0.192)

    carbon_footprint = distance * emission_factor

    return jsonify({
        "distance_km": distance,
        "carbon_footprint_kg": carbon_footprint
    }), 200

@ride_bp.route('/sos/<user_id>', methods=['POST'])
def send_sos(user_id):
    print("SOS request received")
    print(user_id)
    user = mongo.db.users.find_one({"user_id": str(user_id)})

    if not user:
        return jsonify({"message": "User not found"}), 404

    sos_email = user.get('sos_email')

    client_ip = '117.239.0.1'

    g = geocoder.ip(client_ip)
    latitude, longitude = g.latlng if g.latlng else (None, None)

    if not latitude or not longitude:
        return jsonify({"message": "Unable to detect location"}), 400

    msg_body = 'Emergency! Please help me.'

    if request.is_json:
        data = request.get_json()
        msg_body = data.get('msg_body', msg_body)

    msg_body += f"\nCurrent Location: https://www.google.com/maps?q={latitude},{longitude}"

    msg = Message(
        subject='Emergency SOS Alert!',
        sender='aadilharis812@gmail.com',
        recipients=[sos_email],
        body=msg_body
    )
    mail.send(msg)

    return jsonify({"message": "SOS sent successfully"}), 200