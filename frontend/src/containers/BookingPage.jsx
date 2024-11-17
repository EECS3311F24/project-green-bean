import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { postBooking } from '../fetch/bookings';
import {fetchFeedback, postFeedback } from '../fetch/feedback';

const BookingPage = ({ userName }) => {
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

    const [comments,setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedback, setFeedback] = useState([]);

    useEffect(() =>{
        const getFeedback = async () =>{
            try{
                const data = await fetchFeedback(id);
                setFeedback(data);
            } catch(error){
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        getFeedback();
    }, []);
    
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

    const handleCommentChange = (e) =>{
        setNewComment(e.target.value); //set comment for useState
    };

    const handleRatingChange = (e) => {
        setRating(parseInt(e.target.value, 10)); //set rating for useState
    };

    const handleCommentSubmit = async (e) => { //handle form submission for creating a feedback
        e.preventDefault();
        console.log("userName", userName);
        const feedbackData = {
            comment: newComment,
            rating: rating,
            arenaId: id, // Add arena ID to feedback data
            username: userName
        };
        console.log("Form submitted with data:", feedbackData);
        navigate(0, { state: { 
            description: description, 
            image: image,
            name: name,
            id: id
        }}); // Pass arena details to BookingPage

        try {
            const response = await postFeedback(feedbackData); // Call the API function
            console.log('Feedback submitted:', response);
            
        } catch (error) {
            console.error('Error submitting feedback:', error);
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
            <Box mt={8}>
              <Typography variant="h5" gutterBottom>Comments</Typography>
              <form onSubmit={handleCommentSubmit}>
                <TextField
                    fullWidth
                    label="Add a comment"
                    value={newComment}
                    onChange={handleCommentChange}
                    variant="outlined"
                    multiline
                    rows={2}
                />
                <FormControl component="fieldset" style={{marginTop : '25px'}}>
                    <Typography variant="body1">Rate this venue:</Typography>
                    <RadioGroup
                        row
                        value={rating}
                        onChange={handleRatingChange}>
                            {[1, 2, 3, 4, 5].map((value) => (
                                <FormControlLabel
                                key={value}
                                value={value}
                                control={<Radio />}
                                label={`${value} ${value === 1 ? 'star' : 'Stars'}`}
                                />
                            ))}
                        </RadioGroup>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" style={{marginTop: '10px'}}>
                    Submit Comment
                </Button>
                </form>  
                {/* <Box mt={8}>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                        <Box key={index} style={{marginBottom: '10px'}}>
                            <Typography variant="body2" style={{ fontWeight: 'bold'}}>
                                <strong>{comment.userName}</strong>
                        </Typography>
                            <Typography variant="body2" style={{marginTop: '5px'}}>
                            {comment.text}
                            </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Rating: {comment.rating} {comment.rating === 1 ? 'Star': 'Stars'}
                        </Typography>
                        </Box>
                    ))
                ) : (
                    <Typography variant ="body2">No comments yet</Typography>
                )}
                </Box> */}
                <Box mt={8}>
                    {feedback.length > 0 ? (
                        feedback.map((feed, index) => (
                        <Box key={index} style={{marginBottom: '10px'}}>
                            <Typography variant="body2" style={{ fontWeight: 'bold'}}>
                                <strong>{feed.username}</strong>
                        </Typography>
                            <Typography variant="body2" style={{marginTop: '5px'}}>
                            {feed.comment}
                            </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Rating: {feed.rating} {feed.rating === 1 ? 'Star': 'Stars'}
                        </Typography>
                        </Box>
                    ))
                ) : (
                    <Typography variant ="body2">No comments yet</Typography>
                )}
                </Box>
                
            </Box>              
                            
        </Box>
    );
};

export default BookingPage;