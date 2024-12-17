import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Divider,
} from "@mui/material";
import emailjs from "@emailjs/browser";
import { FacebookShareButton, TwitterShareButton } from "react-share";

const ConfirmedBookingPage = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);

  const sendConfirmationEmail = (state) => {
    const serviceID = process.env.REACT_APP_SERVICE_ID;
    const templateID = process.env.REACT_APP_TEMPLATE_ID;
    const userID = process.env.REACT_APP_PUBLIC_KEY;

    const templateParams = {
      to_email: state.email,
      bookingId: state.bookingId,
      firstName: state.firstName,
      lastName: state.lastName,
      phoneNumber: state.phoneNumber,
      email: state.email,
      date: state.date,
      time: state.time,
      isRepeat: state.isRepeat ? "Yes" : "No",
      cardName: state.paymentInfo.cardName,
      cardNumberLast4: state.paymentInfo.cardNumber.slice(-4),
      expiryDate: state.paymentInfo.expiryDate,
    };

    emailjs
      .send(serviceID, templateID, templateParams, userID)
      .then((response) => {
        console.log("Email sent successfully:", response.status, response.text);
        setEmailSent(true); // Update state to show confirmation message
      })
      .catch((error) => {
        console.error("Failed to send email:", error);
      });
  };

  useEffect(() => {
    if (state) {
      sendConfirmationEmail(state);
    }
  }, [state]);

  if (!state) {
    return <Typography variant="h6">No booking details available.</Typography>;
  }

  const {
    bookingId,
    firstName,
    lastName,
    phoneNumber,
    email,
    date,
    time,
    isRepeat,
    paymentInfo,
    name,
  } = state;
  const shareMessage = `I've just booked a stay at ${name} for ${date} at ${time}. Booking ID: ${bookingId}. Join me for an amazing experience!`;

  return (
    <Box sx={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Booking Confirmation
      </Typography>
      <Card variant="outlined" sx={{ marginBottom: "20px" }}>
        <CardContent>
          <Typography variant="h6">Booking ID: {bookingId}</Typography>
          <Divider sx={{ margin: "10px 0" }} />
          <Typography variant="body1">
            <strong>Name:</strong> {firstName} {lastName}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {phoneNumber}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {email}
          </Typography>
          <Typography variant="body1">
            <strong>Date:</strong> {date}
          </Typography>
          <Typography variant="body1">
            <strong>Time:</strong> {time}
          </Typography>
          <Typography variant="body1">
            <strong>Repeat Booking:</strong> {isRepeat ? "Yes" : "No"}
          </Typography>
          <Divider sx={{ margin: "10px 0" }} />
          <Typography variant="h6">Payment Information</Typography>
          <Typography variant="body1">
            <strong>Name on Card:</strong> {paymentInfo.cardName}
          </Typography>
          <Typography variant="body1">
            <strong>Card Number:</strong> **** **** ****{" "}
            {paymentInfo.cardNumber.slice(-4)}
          </Typography>
          <Typography variant="body1">
            <strong>Expiry Date:</strong> {paymentInfo.expiryDate}
          </Typography>
          <Typography variant="body1">
            <strong>CVV:</strong> ***
          </Typography>
        </CardContent>
      </Card>
      <Box sx={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
        <FacebookShareButton
          url={`https://greenbean.com/bookings/${bookingId}`}
          quote={shareMessage}
          hashtag="#HolidayWithGreenBean"
        >
          <Button variant="contained" color="primary">
            Share on Facebook
          </Button>
        </FacebookShareButton>
        <TwitterShareButton
          url={`https://greenbean.com/bookings/${bookingId}`}
          title={shareMessage}
          hashtag="HolidayWithGreanBean"
        >
          <Button variant="contained" color="secondary">
            Share on Twitter
          </Button>
        </TwitterShareButton>
      </Box>
      {emailSent && (
        <Typography
          variant="body2"
          color="success.main"
          sx={{ marginBottom: "20px", textAlign: "center" }}
        >
          A confirmation email has been sent to <strong>{email}</strong>.
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/arenas")}
        fullWidth
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default ConfirmedBookingPage;