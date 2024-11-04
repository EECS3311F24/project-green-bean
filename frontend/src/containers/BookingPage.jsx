import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Typography,
    Card,
    CardMedia,
    CardContent,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Grid,
    Box,
} from '@mui/material';
import { postBooking } from '../fetch/bookings';

const BookingPage = () => {
    const location = useLocation(); // Get the location object
    const navigate = useNavigate(); // Hook for navigation
    const { state } = location; // Get the state passed from the previous page

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        date: '',
        time: '',
        isRepeat: false,
        paymentInfo: {
            cardName: '',
            cardNumber: '',
            expiryDate: '',
            cvv: '',
        },
    });

    // Check if the state exists
    if (!state) {
        return <Typography variant="h6">No arena details available.</Typography>;
    }

    // Destructure the passed data
    const { description, image, name, id } = state;

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('paymentInfo.')) {
            const paymentField = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                paymentInfo: {
                    ...prev.paymentInfo,
                    [paymentField]: value,
                },
            }));
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const bookingData = {
            ...formData,
            arenaId: id, // Add arena ID to booking data
        };

        try {
            const response = await postBooking(bookingData); // Call the API function
            console.log('Booking data submitted:', response);
            // Redirect to the ConfirmedBookingPage with booking details
            navigate('/confirmed', { state: { bookingId: response.id, ...bookingData } });
        } catch (error) {
            console.error('Error submitting booking:', error);
            // Optionally handle the error (e.g., show a message to the user)
        }
    };

    return (
        <Box
            sx={{
                width: '50%', // Set the width to 50%
                margin: '0 auto', // Center the component horizontally
                padding: '20px',
                '@media (max-width:600px)': {
                    width: '90%', // Adjust for smaller screens
                },
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Booking for {name}
            </Typography>
            <Card style={{ marginBottom: '20px' }}>
                <CardMedia
                    component="img"
                    height="240"
                    image={image}
                    alt={name}
                />
                <CardContent>
                    <Typography variant="body1">Description: {description}</Typography>
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
                            control={
                                <Checkbox
                                    name="isRepeat"
                                    checked={formData.isRepeat}
                                    onChange={handleChange}
                                />
                            }
                            label="Repeat Booking"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Payment Information
                        </Typography>
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
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit">
                            Confirm Booking
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default BookingPage;
