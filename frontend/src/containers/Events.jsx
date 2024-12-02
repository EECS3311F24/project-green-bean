import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { fetchEvents } from "../fetch/events";
import { useAuth } from "../state/AuthContext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Events = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    eventTitle: "",
    description: "",
    coverImage: "",
    date: "",
    time: "",
    repeat: "",
    minAge: "",
    maxAge: "",
    paymentDetails: {
      cardNumber: "",
      cvv: "",
      name: "",
      expiryDate: "",
    },
    termsAccepted: false,
  });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadEvents();
    } else {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  

useEffect(() => {
    console.log(events); // Logs when `events` changes
}, [events]);

const handleDisplayEvent = (event) => {
    console.log(event);
    navigate(`/singleEvent/${event.id}`, {
        state: {
            description: event.eventDescription,
            image: event.eventImage,
            name: event.eventTitle,
            arenaName: event.arenaName,
            id: event.id,
            email: event.email,
            phone: event.phoneNumber,
            arenaId: event.arenaId
        }
    }); // Pass arena details to BookingPage
};

  if (loading) return <CircularProgress />;

  return (
    <div style={{ padding: "20px" }}>
      <ArrowBackIcon className='back-arrow' onClick={() => navigate("/arenas")}/>
      <Typography variant="h4" gutterBottom>
        Available Events: {events.length}
      </Typography>

      
      
      {/* Events Grid */}
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} key={event.id}>
            <Card>
              {event.eventImage && (
                <CardMedia
                  component="img"
                  image={event.eventImage}
                  alt={event.eventTitle}
                  style={{ width: "100%", height: "200px" }}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {event.eventTitle}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleDisplayEvent(event)}
                >
                  View Event
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Events;