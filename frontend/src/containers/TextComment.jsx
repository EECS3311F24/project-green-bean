import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchAllFeedback, fetchFeedback, postFeedback } from '../fetch/feedback';
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

const TestCommentPage = ({userName}) => {

    const location = useLocation(); // Get the location object
    const navigate = useNavigate(); // Hook for navigation
    const { state } = location; // Get the state passed from the previous page


    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        comment: '',
        rating: 0,
    });

    // Destructure the passed data
    const { name, id } = state;
    
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value,
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted with data:", formData);
        e.preventDefault();
        const feedbackData = {
            ...formData,
            arenaId: id, // Add arena ID to feedback data
            username: userName
        };

        try {
            const response = await postFeedback(feedbackData); // Call the API function
            console.log('Feedback submitted:', response);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            // Optionally handle the error (e.g., show a message to the user)
        }
    }
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
           {feedback.map((feed) => (
            <Grid container spacing={5} m={2} key={feed.id}>
                <Grid item xs={10}>
                    <Typography component="p" >
                        {feed.comment}
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography component="p" >
                        {feed.rating}
                    </Typography>
                </Grid>
                
            </Grid>
            ))}
        <form onSubmit={handleSubmit}>
            <Grid container spacing={5} m={2}>
                <Grid item xs={10} >
                    <TextField
                        fullWidth
                        label="Comment"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={10} >
                    <TextField
                        fullWidth
                        label="Rating"
                        name="rating"
                        value={formData.rating}
                        type="number"
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
}

export default TestCommentPage;