import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Auth from './pages/Auth';
import RoleSelection from './pages/RoleSelection';
import DriverDashboard from './pages/DriverDashboard';
import PassengerDashboard from './pages/PassengerDashboard';
import RideHistory from './pages/RideHistory';
import { AuthProvider } from './context/AuthContext';
import BookedRideDetails  from './pages/BookedRideDetails'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/driver/*" element={<DriverDashboard />} />
            <Route path="/passenger/*" element={<PassengerDashboard />} />
            <Route path="/history" element={<RideHistory />} />
            <Route path="/booked" element={<BookedRideDetails />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;