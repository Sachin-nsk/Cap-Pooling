from utils.getCordinates import get_coordinates


def create_passenger(user_id, data):
    from_coordinates = get_coordinates(data["from_place"])
    to_coordinates = get_coordinates(data["to_place"])

    return {
        "user_id": user_id,
        "ride_id": None,  # will be updated after driver accepts
        "from_place": data["from_place"],
        "to_place": data["to_place"],
        "from_coordinates": from_coordinates,
        "to_coordinates": to_coordinates,
        "preferred_car_type": data["preferred_car_type"]
    }
