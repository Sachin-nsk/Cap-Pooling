from flask import Flask
from flask_cors import CORS
from controllers.user_controller import user_bp
from controllers.driver_controller import driver_bp
from controllers.passenger_controller import passenger_bp
from controllers.ride_controller import ride_bp
from extensions import mongo, mail

app = Flask(__name__)

# Enable CORS for specific origin (your React app)
CORS(app)

# MongoDB Config
app.config["MONGO_URI"] = "mongodb+srv://aadilharis812:1234@cluster0.0fungav.mongodb.net/car_pooling?retryWrites=true&w=majority&appName=Cluster0"

# Mail Config
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'aadilharis812@gmail.com'
app.config['MAIL_PASSWORD'] = 'svak eavb sowt jrcc'  # App-specific password
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mongo.init_app(app)
mail.init_app(app)

# Register Blueprints
app.register_blueprint(user_bp)
app.register_blueprint(driver_bp)
app.register_blueprint(passenger_bp)
app.register_blueprint(ride_bp)

if __name__ == "__main__":
    print("Starting the Flask app...")
    app.run(debug=True)
