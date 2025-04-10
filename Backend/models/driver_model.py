from utils.getCordinates import get_coordinates

def create_driver(user_id, data, ride_id):
    from_place = data.get("from_place")
    to_place = data.get("to_place")

    from_coordinates = get_coordinates(from_place)
    to_coordinates = get_coordinates(to_place)

    return {
        "user_id": user_id,
        "ride_id": ride_id,  # Reference from rides collection
        "from_place": from_place,
        "to_place": to_place,
        "from_coordinates": from_coordinates,
        "to_coordinates": to_coordinates,
        "car_model": data.get("car_model"),
        "car_type": data.get("car_type"),
        "car_regno": data.get("car_regno"),
        "no_of_passengers_can_be_taken": int(data.get("no_of_passengers_can_be_taken")),
        "phone_no": data.get("phone_no")
    }
