import React, { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext'; // Assuming you have AuthContext for user info
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // Importing the Edit icon
import './_styling/currentBooking.css'; // Add your CSS styling

const CurrentBooking = () => {
  const { userName } = useAuth(); // Assuming userName is available in AuthContext
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to check if booking is current or past
  const isCurrentBooking = (bookingDate, bookingTime) => {
    const bookingDateTime = new Date(`${bookingDate} ${bookingTime}`);
    const currentDateTime = new Date();
    return bookingDateTime >= currentDateTime; // returns true if booking is in the future
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      const fetchBookings = async () => {
        try {
          const url = new URL('http://localhost:3000/api/bookings/user');
          const params = { email };
          url.search = new URLSearchParams(params).toString();
  
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Failed to fetch current bookings');
          }
  
          const data = await response.json();
          console.log(data);
          setBookings(data);
        } catch (err) {
          setError(err.message || 'Failed to fetch current bookings');
        } finally {
          setLoading(false);
        }
      };
  
      fetchBookings();
    }
  }, []); // Empty dependency array to run only once on mount
  

  return (
    <div className="current-booking-container">
      <h1 style={{fontSize: '36px'}}>Bookings</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="booking-list">
        {/* Current Bookings */}
        <h1 style={{fontSize: '25px'}}>Current Bookings</h1>
        {bookings.filter(booking => isCurrentBooking(booking.date, booking.time)).length === 0 ? (
          <p>No current bookings</p>
        ) : (
          bookings
            .filter(booking => isCurrentBooking(booking.date, booking.time))
            .map((booking) => (
              <div className="booking-item" key={booking.id}>
                <div className="booking-details">
                  <p><strong>Arena Name:</strong> {booking.arenaName}</p>
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Time:</strong> {booking.time}</p>
                  <p><strong>Email:</strong> {booking.email}</p>
                </div>
                <div className="edit-btn-container">
                  <IconButton className="edit-btn" aria-label="edit booking">
                    <EditIcon />
                  </IconButton>
                </div>
              </div>
            ))
        )}

        {/* Past Bookings */}
        <h1 style={{fontSize: '25px'}}>Past Bookings</h1>
        {bookings.filter(booking => !isCurrentBooking(booking.date, booking.time)).length === 0 ? (
          <p>No past bookings</p>
        ) : (
          bookings
            .filter(booking => !isCurrentBooking(booking.date, booking.time))
            .map((booking) => (
              <div className="booking-item" key={booking.id}>
                <div className="booking-details">
                  <p><strong>Arena ID:</strong> {booking.arenaId}</p>
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Time:</strong> {booking.time}</p>
                  <p><strong>Email:</strong> {booking.email}</p>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default CurrentBooking;
