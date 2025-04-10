import React from 'react';

const RideHistory = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ride History</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {/* Placeholder for ride history items */}
          <p className="text-gray-600">No ride history available.</p>
        </div>
      </div>
    </div>
  );
};

export default RideHistory;