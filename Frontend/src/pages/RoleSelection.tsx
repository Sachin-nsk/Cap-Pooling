import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Users } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <button
          onClick={() => navigate('/driver')}
          className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow flex flex-col items-center justify-center space-y-4"
        >
          <Car className="h-16 w-16 text-indigo-600" />
          <h2 className="text-2xl font-semibold text-gray-800">I'm a Driver</h2>
          <p className="text-gray-600 text-center">
            Offer rides and earn while helping others reach their destination
          </p>
        </button>

        <button
          onClick={() => navigate('/passenger')}
          className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow flex flex-col items-center justify-center space-y-4"
        >
          <Users className="h-16 w-16 text-indigo-600" />
          <h2 className="text-2xl font-semibold text-gray-800">I'm a Passenger</h2>
          <p className="text-gray-600 text-center">
            Find and book rides that match your route and schedule
          </p>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;