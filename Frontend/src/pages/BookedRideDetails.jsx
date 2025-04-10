import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const BookedRideDetails = () => {
  const location = useLocation();
  const { driver_id, user_id } = location.state;

  const [ride, setRide] = useState(null);
  const [carbonFootprint, setCarbonFootprint] = useState(null);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const resRide = await axios.get(`http://localhost:5000/ride/driver/${driver_id}`);
        console.log(resRide.data);
        setRide(resRide.data);
      } catch (error) {
        console.error('Error fetching ride details:', error);
      }
    };

    fetchRideDetails();
  }, [driver_id]);

  const handlePredictPrice = async () => {
    try {
      const resPrice = await axios.get(`http://localhost:5000/ride/predict-cost/${driver_id}`);
      setPrice(resPrice.data.data.predicted_price);
    } catch (err) {
      console.error('Error fetching price:', err);
    }
  };

  const handleCarbonFootprint = async () => {
    try {
      const resCarbon = await axios.get(`http://localhost:5000/ride/carbon-footprint/${user_id}`);
      console.log(resCarbon.data.carbon_footprint_kg);
      setCarbonFootprint(resCarbon.data.carbon_footprint_kg);
    } catch (err) {
      console.error('Error fetching carbon footprint:', err);
    }
  };

  const handleSos = async () => {
    try {
      await axios.post(`http://localhost:5000/ride/sos/${user_id}`);
      alert('SOS Email Sent to Emergency Contact!');
    } catch (err) {
      console.error('Error sending SOS:', err);
      alert('Failed to send SOS!');
    }
  };

  if (!ride) return <p>Loading ride details...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-600">Ride Booked Successfully!</h1>

      <div className="mb-4">
        <p><strong>Driver Name:</strong> {ride.driver_id}</p>
        <p><strong>Car Name:</strong> {ride.car_model}</p>
        <p><strong>Pickup Location:</strong> {ride.from_place}</p>
        <p><strong>Drop Location:</strong> {ride.to_place}</p>
      </div>

      <button
        onClick={handlePredictPrice}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Predict Price
      </button>

      {price && (
        <p className="mt-2">Predicted Price: $ {price.toFixed(2)}</p>
      )}

      <button
        onClick={handleCarbonFootprint}
        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
      >
        Calculate Carbon Footprint
      </button>

      {carbonFootprint && (
        <p className="mt-2">Carbon Footprint: {carbonFootprint.toFixed(2)} kg CO₂</p>
      )}

      <button
        onClick={handleSos}
        className="bg-red-600 text-white px-4 py-2 rounded mt-4"
      >
        SOS
      </button>
    </div>
  );
};

export default BookedRideDetails;
