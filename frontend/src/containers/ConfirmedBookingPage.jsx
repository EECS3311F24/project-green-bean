import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Card, CardContent, Button, Box, Divider } from '@mui/material';

const ConfirmedBookingPage = () => {
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate(); 

    if (!state) {
        return <Typography variant="h6">No booking details available.</Typography>;
    }

    const { bookingId, firstName, lastName, phoneNumber, email, date, time, isRepeat, paymentInfo } = state;

    return (
        <Box sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Booking Confirmation
            </Typography>
            <Card variant="outlined" sx={{ marginBottom: '20px' }}>
                <CardContent>
                    <Typography variant="h6">Booking ID: {bookingId}</Typography>
                    <Divider sx={{ margin: '10px 0' }} />
                    <Typography variant="body1"><strong>Name:</strong> {firstName} {lastName}</Typography>
                    <Typography variant="body1"><strong>Phone:</strong> {phoneNumber}</Typography>
                    <Typography variant="body1"><strong>Email:</strong> {email}</Typography>
                    <Typography variant="body1"><strong>Date:</strong> {date}</Typography>
                    <Typography variant="body1"><strong>Time:</strong> {time}</Typography>
                    <Typography variant="body1"><strong>Repeat Booking:</strong> {isRepeat ? 'Yes' : 'No'}</Typography>
                    <Divider sx={{ margin: '10px 0' }} />
                    <Typography variant="h6">Payment Information</Typography>
                    <Typography variant="body1"><strong>Name on Card:</strong> {paymentInfo.cardName}</Typography>
                    <Typography variant="body1"><strong>Card Number:</strong> **** **** **** {paymentInfo.cardNumber.slice(-4)}</Typography>
                    <Typography variant="body1"><strong>Expiry Date:</strong> {paymentInfo.expiryDate}</Typography>
                    <Typography variant="body1"><strong>CVV:</strong> ***</Typography>
                </CardContent>
            </Card>
            <Button variant="contained" color="primary" onClick={() => navigate('/arenas')} fullWidth>
                Back to Home
            </Button>
        </Box>
    );
};

export default ConfirmedBookingPage;
