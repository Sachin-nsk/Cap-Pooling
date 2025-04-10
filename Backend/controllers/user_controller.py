from flask import Blueprint, request, jsonify
from extensions import mongo
from models.user_model import create_user
from werkzeug.security import generate_password_hash, check_password_hash

user_bp = Blueprint('user', __name__, url_prefix='/user')


# Register User
@user_bp.route('/create', methods=['POST'])
def create_user_controller():
    print("Creating user...")
    data = request.get_json()

    # Check if username already exists
    existing_user = mongo.db.users.find_one({"username": data.get("username")})
    if existing_user:
        return jsonify({"message": "Username already taken"}), 400

    user = create_user(data)
    result = mongo.db.users.insert_one(user)

    user_id = str(result.inserted_id)

    # Update user_id field
    mongo.db.users.update_one(
        {"_id": result.inserted_id},
        {"$set": {"user_id": user_id}}
    )

    return jsonify({
        "message": "User created successfully",
        "user_id": user_id
    }), 201


# Login User
@user_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    user = mongo.db.users.find_one({"username": username})

    if not user:
        return jsonify({"message": "Invalid username"}), 404

    if not check_password_hash(user["password"], password):
        return jsonify({"message": "Invalid password"}), 401

    return jsonify({
        "message": "Login successful",
        "user_id": user["user_id"]
    }), 200
