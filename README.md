
# RideShare Application

## Overview

This is a full-stack ridesharing application built with Flask for the backend and React/TypeScript for the frontend. The application helps connect drivers and passengers, facilitating carpooling and ridesharing to reduce carbon emissions.

## Features

- User registration and authentication
- Driver ride creation and management
- Passenger ride search and booking
- Carbon footprint calculation
- Cost prediction for rides using machine learning
- SOS emergency alert system

## Tech Stack

### Backend
- Flask (Python web framework)
- MongoDB (NoSQL database)
- Flask-Mail for email functionality
- GeoPy for distance calculations
- Geocoder for location detection

### Frontend
- React 18
- TypeScript
- Vite for build tooling
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API requests
- React Hot Toast for notifications

## Project Structure

The backend is organized into blueprints:
- `driver_bp`: Handles driver-related operations
- `passenger_bp`: Manages passenger functionality
- `ride_bp`: Controls ride operations, searching, and booking
- `user_bp`: Handles user authentication and management

## Setup Instructions

### Prerequisites
- Node.js (version 16+)
- Python 3.8+
- MongoDB

### Backend Setup
1. Clone the repository
2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set up environment variables (database connection, mail server, etc.)
4. Run the Flask server:
   ```
   python app.py
   ```

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### User Management
- `POST /user/create`: Register a new user
- `POST /user/login`: Authenticate a user

### Driver Operations
- `POST /driver/create/<user_id>`: Create a new driver and ride

### Passenger Operations
- `POST /passenger/create/<user_id>`: Create a new passenger

### Ride Operations
- `GET /ride/all`: Get all available rides
- `GET /ride/driver/<driver_id>`: Get ride by driver ID
- `GET /ride/passenger/<passenger_id>`: Search rides for a passenger
- `POST /ride/book/<passenger_id>/<driver_id>`: Book a ride
- `GET /ride/predict-cost/<driver_id>`: Predict the cost of a ride
- `GET /ride/carbon-footprint/<user_id>`: Calculate carbon footprint
- `POST /ride/sos/<user_id>`: Send SOS alert

## Development

- For linting: `npm run lint`
- For building: `npm run build`
- For previewing the build: `npm run preview`

## Environmental Impact

The application includes features to calculate and display the carbon footprint of rides, promoting eco-friendly transportation choices. Emission factors are provided for different car types.

## Security Features

- Password hashing using werkzeug.security
- User authentication system
- SOS emergency system for safety
