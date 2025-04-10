from werkzeug.security import generate_password_hash

def create_user(data):
    hashed_password = generate_password_hash(data.get("password"))

    return {
        "name": data.get("name"),
        "username": data.get("username"),
        "address": data.get("address"),
        "phone_no": data.get("phone_no"),
        "email_id": data.get("email_id"),
        "password": hashed_password,
        "rides_as_driver": 0,
        "rides_as_passenger": 0,
        "rides": [],
        "sos_email": data.get("sos_email"),
    }
