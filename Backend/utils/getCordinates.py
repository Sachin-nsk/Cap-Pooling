from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent="carpooling_app")

def get_coordinates(address):
    location =geolocator.geocode(address)
    if location:
        return{
            "latitude": location.latitude,
            "longitude": location.longitude
        }
    else:
        return {
            "error":"Location not found"
        }