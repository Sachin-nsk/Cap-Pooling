import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const RideCard = ({ ride, userid }) => {
    const navigate = useNavigate();
    console.log(ride);
    console.log(userid);
  const handleBookRide = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/ride/book/${userid}/${ride.driver_id}`);
        console.log(response.data);
      if (response.status === 200) {
        // Navigate with only driver_id
        navigate('/booked', { state: { driver_id: ride.driver_id ,user_id:userid} });
      } else {
        alert('Failed to book ride');
      }
    } catch (error) {
      console.error('Booking Error:', error);
      alert('Error booking ride');
    }
  };
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Driver: {ride.driver_id}</h2>

      <div className="flex items-center gap-2 mb-1">
        From: {ride.from_place}
      </div>

      <div className="flex items-center gap-2 mb-1">
        To: {ride.to_place}
      </div>

      <div className="flex items-center gap-2 mb-1">
        Car Type: {ride.car_type}
      </div>

      <div className="flex items-center gap-2 mb-1">
        Seats Available: {ride.no_of_passengers_can_be_taken}
      </div>

      <button
        onClick={handleBookRide}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Book Ride
      </button>
    </div>
  );;
};

export default RideCard;

