from flask import Blueprint, request, jsonify
from extensions import mongo
from models.ride_model import create_ride
from models.driver_model import create_driver

driver_bp = Blueprint('driver', __name__, url_prefix='/driver')

@driver_bp.route('/create/<user_id>', methods=['POST'])
def create_driver_controller(user_id):
    data = request.get_json()
    print("Creating driver...")
    # Step 1: Create Ride Object
    ride_obj = create_ride(user_id, data)
    ride_insert_result = mongo.db.rides.insert_one(ride_obj)
    ride_id = str(ride_insert_result.inserted_id)

    # Step 2: Create Driver Object
    driver_obj = create_driver(user_id, data, ride_id)
    mongo.db.drivers.insert_one(driver_obj)

    # Step 3: Update User Collection
    mongo.db.users.update_one(
        {"user_id": str(user_id)},
        {
            "$inc": {"rides_as_driver": 1},
            "$push": {"rides": {"driver_id": user_id, "role": "driver"}}
        }
    )

    return jsonify({"message": "Driver and Ride created successfully", "ride_id": ride_id}), 201
