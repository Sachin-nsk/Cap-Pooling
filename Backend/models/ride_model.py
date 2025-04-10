from utils.getCordinates import get_coordinates

def create_ride(driver_id, data):
    from_place = data.get("from_place")
    to_place = data.get("to_place")

    return {
        "driver_id": driver_id,
        "from_place": from_place,
        "to_place": to_place,
        "from_coordinates": get_coordinates(from_place),   # Extracted
        "to_coordinates": get_coordinates(to_place),       # Extracted
        "car_model": data.get("car_model"),
        "car_type": data.get("car_type").lower(),  # Convert to lowercase
        "car_regno": data.get("car_regno"),
        "no_of_passengers_can_be_taken": int (data.get("no_of_passengers_can_be_taken")),
        "phone_no": data.get("phone_no")
    }
