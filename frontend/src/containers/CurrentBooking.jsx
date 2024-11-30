import React, { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext'; 
import { useNavigate } from "react-router-dom";
import { Typography, IconButton, Dialog, Box, Alert, Snackbar, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit'; 
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import './_styling/currentBooking.css'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CurrentBooking = () => {
  const { userName } = useAuth(); 
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [editBooking, setEditBooking] = useState(null); 
  const [newTime, setNewTime] = useState("");
  const [newDate, setNewDate] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Helper function to check if booking is current or past
  const isCurrentBooking = (bookingDate, bookingTime) => {
    const bookingDateTime = new Date(`${bookingDate} ${bookingTime}`);
    const currentDateTime = new Date();
    return bookingDateTime >= currentDateTime; 
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
    
          const data = await response.json();
          if (data.message == "No bookings found for this user") {
            return;
          }

          if (!response.ok) {
            throw new Error('Failed to fetch current bookings');
          }
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
  }, []); 

  const handleEdit = (booking) => {
    setEditBooking(booking);
    setNewDate(booking.date);
    setNewTime(booking.time);
  };

  const handleSave = async () => {
    try {
      const availabilityCheck = await fetch("http://localhost:3000/api/bookings/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arenaId: editBooking.arenaId, date: newDate, time: newTime }),
      });
      const availability = await availabilityCheck.json();

      if (!availability.available) {
        setSnackbar({ open: true, message: "Selected time is not available", severity: "error" });
        return;
      }

      const response = await fetch(`http://localhost:3000/api/bookings/${editBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate, time: newTime, arenaId: editBooking.arenaId }),
      });

      if (!response.ok) throw new Error("Failed to update booking");

      setSnackbar({ open: true, message: "Booking updated successfully", severity: "success" });
      setEditBooking(null);
      setBookings((prev) =>
        prev.map((b) => (b.id === editBooking.id ? { ...b, date: newDate, time: newTime } : b))
      );
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  // Filter bookings based on search term
  const filteredBookings = bookings.filter((booking) => {
    const bookingDetails = `${booking.arenaName} ${booking.date} ${booking.time} ${booking.email}`.toLowerCase();
    return bookingDetails.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="current-booking-container">
      <ArrowBackIcon className='back-arrow' onClick={() => navigate("/arenas")}/>
      <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Bookings
                </Typography>
        <TextField
            variant="outlined"
            placeholder="Search Bookings by Arena, Email, Time, or Date..."
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'gray', fontSize: 22 }} />
                    </InputAdornment>
                ),
                endAdornment: (
                    searchTerm.length >= 1 ?
                        <InputAdornment position="end">
                            <CloseIcon onClick={() => setSearchTerm("")} sx={{ color: 'gray', fontSize: 22, cursor: 'pointer' }} />
                        </InputAdornment>
                        :
                        null
                )
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: '50px',
                },
                width: '500px',
                position: 'relative',
                marginTop: '10px',
                marginBottom: '20px',
            }}
        />
        </Box>
      
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      
      <div className="booking-list">
        {/* Current Bookings */}
        <h1 style={{fontSize: '25px'}}>Current Bookings</h1>
        {filteredBookings.filter(booking => isCurrentBooking(booking.date, booking.time)).length === 0 ? (
          <p className='no-book-text'>No current bookings</p>
        ) : (
          filteredBookings
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
                    <EditIcon onClick={() => handleEdit(booking)}/>
                  </IconButton>
                </div>
              </div>
            ))
        )}

        {/* Past Bookings */}
        <h1 style={{fontSize: '25px'}}>Past Bookings</h1>
        {filteredBookings.filter(booking => !isCurrentBooking(booking.date, booking.time)).length === 0 ? (
          <p className='no-book-text '>No past bookings</p>
        ) : (
          filteredBookings
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

      <Dialog open={!!editBooking} onClose={() => setEditBooking(null)}>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="body1"><strong>Arena Name:</strong> {editBooking?.arenaName}</Typography>
          </Box>
          <TextField
            label="Date"
            type="date"
            fullWidth
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            sx={{ marginBottom: 2, marginTop: 2 }}
          />
          <TextField
            label="Time"
            type="time"
            fullWidth
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setEditBooking(null)} 
            sx={{ color: 'red',
              '&:hover': {
                backgroundColor: 'red',
                color: 'white'  
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            sx={{
              '&:hover': {
                backgroundColor: '#4CAF50', 
                color: 'white' 
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CurrentBooking;
