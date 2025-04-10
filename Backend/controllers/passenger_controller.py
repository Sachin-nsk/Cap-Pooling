from flask import Blueprint, request, jsonify
from extensions import mongo
from models.passenger_model import create_passenger

passenger_bp = Blueprint('passenger', __name__, url_prefix='/passenger')

@passenger_bp.route('/create/<user_id>', methods=['POST'])
def create_passenger_controller(user_id):
    print(user_id)
    data = request.get_json()
   # print(data)
    # Create Passenger Object
    passenger_data = create_passenger(user_id, data)
    mongo.db.passenger.insert_one(passenger_data)

    # Update User Collection:
    mongo.db.users.update_one(
        {"user_id": user_id},
        {
            "$inc": {"rides_as_passenger": 1},
            "$push": {
                "rides": {
                    "role": "passenger",
                    "ride_id": None  # will update after driver accepts
                }
            }
        }
    )

    return jsonify({"message": "Passenger created successfully"}), 201
