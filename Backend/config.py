import os
from dotenv import load_dotenv

load_dotenv()

class Config:

    MONGO_URI = os.getenv("MONGO_URI")
    GEO_API_KEY = os.getenv("GEO_API_KEY")