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

  // Handle form changes
  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (field, nestedField, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        [nestedField]: value,
      },
    }));
  };

  // Handle form submission
  const handleCreateEvent = () => {
    if (!formData.termsAccepted) {
      alert("Please accept the terms and conditions.");
      return;
    }

    const newEvent = {
      id: events.length + 1, // Temporary ID
      title: formData.eventTitle,
      image: formData.coverImage,
      date: formData.date,
      description: formData.description,
      minAge: formData.minAge,
      maxAge: formData.maxAge,
    };

    setEvents([newEvent, ...events]);
    setIsModalOpen(false);
    setFormData({
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
  };

  if (loading) return <CircularProgress />;

  return (
    <div style={{ padding: "20px" }}>
      <ArrowBackIcon className='back-arrow' onClick={() => navigate("/arenas")}/>
      <Typography variant="h4" gutterBottom>
        Available Events: {events.length}
      </Typography>

      {/* Button to open modal */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: "20px" }}
      >
        Create New Event
      </Button>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          {/* Contact Section */}
          <Typography variant="h6">Contact</Typography>
          <TextField
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            fullWidth
            margin="normal"
          />

          {/* Event Section */}
          <Typography variant="h6">Event</Typography>
          <TextField
            label="Title of Event"
            value={formData.eventTitle}
            onChange={(e) => handleInputChange("eventTitle", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            label="Cover Image URL"
            value={formData.coverImage}
            onChange={(e) => handleInputChange("coverImage", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Minimum Age"
            value={formData.minAge}
            onChange={(e) => handleInputChange("minAge", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Maximum Age"
            value={formData.maxAge}
            onChange={(e) => handleInputChange("maxAge", e.target.value)}
            fullWidth
            margin="normal"
          />

          {/* Duration Section */}
          <Typography variant="h6">Duration</Typography>
          <TextField
            label="Select Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Time"
            value={formData.time}
            onChange={(e) => handleInputChange("time", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Repeat (e.g., daily, weekly)"
            value={formData.repeat}
            onChange={(e) => handleInputChange("repeat", e.target.value)}
            fullWidth
            margin="normal"
          />

          {/* Payment Section */}
          <Typography variant="h6">Payment</Typography>
          <TextField
            label="Credit Card Number"
            value={formData.paymentDetails.cardNumber}
            onChange={(e) =>
              handleNestedInputChange("paymentDetails", "cardNumber", e.target.value)
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="CVV"
            value={formData.paymentDetails.cvv}
            onChange={(e) =>
              handleNestedInputChange("paymentDetails", "cvv", e.target.value)
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name on Card"
            value={formData.paymentDetails.name}
            onChange={(e) =>
              handleNestedInputChange("paymentDetails", "name", e.target.value)
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Expiry Date (MM/YY)"
            value={formData.paymentDetails.expiryDate}
            onChange={(e) =>
              handleNestedInputChange("paymentDetails", "expiryDate", e.target.value)
            }
            fullWidth
            margin="normal"
          />

          {/* Terms Section */}
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.termsAccepted}
                onChange={(e) =>
                  handleInputChange("termsAccepted", e.target.checked)
                }
              />
            }
            label="I have read all Terms and Conditions"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateEvent} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Events Grid */}
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} key={event.id}>
            <Card>
              {event.image && (
                <CardMedia
                  component="img"
                  image={event.image}
                  alt={event.title}
                  style={{ width: "100%", height: "200px" }}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {event.title}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate(`/events/${event.id}`)}
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