import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, Users, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [rideDetails, setRideDetails] = useState(null);
  const [formData, setFormData] = useState({
    from_place: '',
    to_place: '',
    car_model: '',
    car_type: '',
    car_regno: '',
    no_of_passengers_can_be_taken: '',
    phone_no: ''
  });
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    fetchRideDetails();
  }, [user]);

  const fetchRideDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/ride/driver/${user?.user_id}`);
      const data = await response.json();
      if (response.ok) {
        setRideDetails(data);
        // Fetch passengers if ride exists
        if (data.users?.length) {
          const passengerPromises = data.users.map(passengerId =>
            fetch(`http://localhost:5000/passenger/${passengerId}`).then(res => res.json())
          );
          const passengersData = await Promise.all(passengerPromises);
          setPassengers(passengersData);
        }
      }
    } catch (error) {
      console.error('Error fetching ride details:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/driver/create/${user?.user_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Ride created successfully!');
        fetchRideDetails(); // Refresh ride details
      } else {
        toast.error(data.message || 'Failed to create ride');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleEndRide = async () => {
    try {
      const response = await fetch(`http://localhost:5000/ride/end/${rideDetails?._id}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success('Ride ended successfully');
        setRideDetails(null);
        setPassengers([]);
      }
    } catch (error) {
      toast.error('Failed to end ride');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Driver Dashboard</h1>
      
      {!rideDetails ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create a New Ride</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">From</label>
                <input
                  type="text"
                  value={formData.from_place}
                  onChange={(e) => setFormData({ ...formData, from_place: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">To</label>
                <input
                  type="text"
                  value={formData.to_place}
                  onChange={(e) => setFormData({ ...formData, to_place: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Car Model</label>
                <input
                  type="text"
                  value={formData.car_model}
                  onChange={(e) => setFormData({ ...formData, car_model: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Car Type</label>
                <select
                  value={formData.car_type}
                  onChange={(e) => setFormData({ ...formData, car_type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select car type</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="muv">MUV</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Car Registration Number</label>
                <input
                  type="text"
                  value={formData.car_regno}
                  onChange={(e) => setFormData({ ...formData, car_regno: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Passengers</label>
                <input
                  type="number"
                  value={formData.no_of_passengers_can_be_taken}
                  onChange={(e) => setFormData({ ...formData, no_of_passengers_can_be_taken: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone_no}
                  onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white rounded-md py-2 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create Ride
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Current Ride</h2>
              <button
                onClick={handleEndRide}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                End Ride
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium">{rideDetails.from_place}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="font-medium">{rideDetails.to_place}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Car className="text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-medium">{rideDetails.car_model} ({rideDetails.car_type})</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Users className="text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Available Seats</p>
                  <p className="font-medium">{rideDetails.no_of_passengers_can_be_taken}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Passengers</h2>
            {passengers.length > 0 ? (
              <div className="space-y-4">
                {passengers.map((passenger, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{passenger.name}</p>
                        <p className="text-sm text-gray-500">{passenger.phone_no}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Pickup: {passenger.from_place}</p>
                        <p className="text-sm text-gray-500">Drop: {passenger.to_place}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No passengers yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;