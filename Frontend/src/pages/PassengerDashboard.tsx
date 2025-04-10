import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import RideCard from './RideCard';  // Import RideCard component
import toast from 'react-hot-toast';

const PassengerDashboard = () => {
  const { user } = useAuth();
  const [step, setStep] = useState('search');  // 'search' | 'rides'
  const [formData, setFormData] = useState({
    from_place: '',
    to_place: '',
    preferred_car_type: ''
  });
  const [rides, setRides] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const r=await fetch(`http://localhost:5000/passenger/create/${user?.user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const res = await fetch(`http://localhost:5000/ride/passenger/${user?.user_id}`, {
        method: 'GET'
      });

      const data = await res.json();
      console.log(data);

      if (res.ok && data) {
        setRides(Array.isArray(data) ? data : [data]);
        setStep('rides');
        toast.success('Rides Found!');
      } else {
        toast.error('No Rides Found');
      }
    } catch (err) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {step === 'search' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="from_place"
            placeholder="From Place"
            value={formData.from_place}
            onChange={handleChange}
            className="w-full border p-2"
          />
          <input
            type="text"
            name="to_place"
            placeholder="To Place"
            value={formData.to_place}
            onChange={handleChange}
            className="w-full border p-2"
          />
          <input
            type="text"
            name="preferred_car_type"
            placeholder="Preferred Car Type"
            value={formData.preferred_car_type}
            onChange={handleChange}
            className="w-full border p-2"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Search Ride
          </button>
        </form>
      )}

      {step === 'rides' && (
        <div className="space-y-4">
          {rides.map((ride) => (
            <RideCard key={ride._id} ride={ride} userid={user?.user_id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PassengerDashboard;


