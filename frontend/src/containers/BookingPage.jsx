import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { postBooking, checkAvailability } from "../fetch/bookings";
import { fetchFeedback, postFeedback } from "../fetch/feedback";
import "./_styling/bookingPage.css"

const BookingPage = ({ userName }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { description, image, name, id } = state;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    arenaName:name,
    email: "",
    date: "",
    time: "",
    isRepeat: false,
    paymentInfo: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const [feedback, setFeedback] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const data = await fetchFeedback(state.id);
        setFeedback(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    if (state?.id) {
      fetchFeedbackData();
    }
  }, [state]);

  if (!state) {
    return <Typography variant="h6">No arena details available.</Typography>;
  }



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("paymentInfo.")) {
      const paymentField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        paymentInfo: {
          ...prev.paymentInfo,
          [paymentField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookingData = { ...formData, arenaId: id };

    try {
      const isAvailable = await checkAvailability(bookingData);
      if (!isAvailable) {
        setAvailabilityMessage("The selected time slot is not available. Please choose another.");
        return;
      }

      const response = await postBooking(bookingData);
      navigate("/confirmed", { state: { bookingId: response.id, ...bookingData } });
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const feedbackData = {
      comment: newComment,
      rating,
      arenaId: id,
      username: userName,
    };

    try {
      await postFeedback(feedbackData);
      setFeedback((prev) => [...prev, feedbackData]);
      setNewComment("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <>
        <ArrowBackIcon className='back-arrow' onClick={() => navigate("/arenas")}/>
    <Box
      sx={{
        width: "50%",
        margin: "0 auto",
        padding: "20px",
        "@media (max-width:600px)": { width: "90%" },
      }}
    >
      <Typography variant="h4" gutterBottom>
        Booking for {name}
      </Typography>
      <Card sx={{ mb: 2 }}>
        <CardMedia component="img" height="240" image={image} alt={name} />
        <CardContent>
          <Typography>Description: {description}</Typography>
        </CardContent>
      </Card>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Time"
              name="time"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={formData.time}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox name="isRepeat" checked={formData.isRepeat} onChange={handleChange} />}
              label="Repeat Booking"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Payment Information</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cardholder Name"
              name="paymentInfo.cardName"
              value={formData.paymentInfo.cardName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Card Number"
              name="paymentInfo.cardNumber"
              value={formData.paymentInfo.cardNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              name="paymentInfo.expiryDate"
              type="month"
              value={formData.paymentInfo.expiryDate}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="CVV"
              name="paymentInfo.cvv"
              type="password"
              value={formData.paymentInfo.cvv}
              onChange={handleChange}
              required
            />
          </Grid>
          {availabilityMessage && (
            <Grid item xs={12}>
              <Typography color="error">{availabilityMessage}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button variant="contained" type="submit" color="primary">
              Confirm Booking
            </Button>
          </Grid>
        </Grid>
      </form>
      <Box mt={8}>
        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>
        <form onSubmit={handleCommentSubmit}>
          <TextField
            fullWidth
            label="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            multiline
            rows={2}
          />
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <Typography>Rate this venue:</Typography>
            <RadioGroup row value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((value) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio />}
                  label={`${value} Star${value > 1 ? "s" : ""}`}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Button variant="contained" type="submit" sx={{ mt: 2 }}>
            Submit Comment
          </Button>
        </form>
        <Box mt={4}>
          {feedback.length > 0 ? (
            feedback.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {item.username}
                </Typography>
                <Typography>{item.comment}</Typography>
                <Typography color="textSecondary">
                  Rating: {item.rating} Star{item.rating > 1 ? "s" : ""}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No comments yet.</Typography>
          )}
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default BookingPage;
