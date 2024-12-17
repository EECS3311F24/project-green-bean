//This page is used for testing the apis for feedback.js

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchAllFeedback, fetchFeedback, postFeedback } from '../fetch/feedback';
import {
    Typography,
    TextField,
    Button,
    Grid,
    Box,
} from '@mui/material';
import io from "socket.io-client";
const socket = io("http://localhost:3000");

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
    
    useEffect(() =>{ // fetche the feedback collection from firebase. Depending on the arena id
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

        socket.on("new-feedback", (newFeedback) => {
            setFeedback((prevFeedback) => [...prevFeedback, newFeedback]);
        });

        return () => socket.off("new-feedback");
    }, []);

    const handleChange = (e) => { //gets value from the text fields
        const { name, value, type, checked } = e.target;
            setFormData({
                ...formData,
                [name]: type === "number" ? Number(value) : value,
            });
    };

    const handleSubmit = async (e) => { //handle form submission for creating a feedback
        e.preventDefault();
        console.log("Form submitted with data:", formData);

        console.log("userName", userName);
        e.preventDefault();
        const feedbackData = {
            ...formData,
            arenaId: id, // Add arena ID to feedback data
            username: userName
        };

        console.log("Form submitted with data:", feedbackData);

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