import pickle
import pandas as pd
from geopy.distance import geodesic


# Load your trained ML model
with open('trained_models/ride_cost_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)


def calculate_distance(coord1, coord2):
    return geodesic(coord1, coord2).km


def predict_ride_cost(driver_start, driver_end, passengers):
    results = []
    #print("Called")
    driver_start_km = calculate_distance((0, 0), driver_start)
    driver_end_km = calculate_distance((0, 0), driver_end)

    for passenger in passengers:
        passenger_start_km = calculate_distance((0, 0), passenger['start'])
        passenger_end_km = calculate_distance((0, 0), passenger['end'])

        df = pd.DataFrame([{
            'driver_start': driver_start_km,
            'driver_end': driver_end_km,
            'rider_start': passenger_start_km,
            'rider_end': passenger_end_km,
            'number_of_riders': 2,  # 1 driver + 1 passenger
            'percentage': 100.0
        }])

        predicted_price = model.predict(df)[0]

        results.append({
            'predicted_price': predicted_price
        })
        #print(predicted_price)
    return results[0]
