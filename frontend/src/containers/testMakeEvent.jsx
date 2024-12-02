import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Typography,
    Card,
    CardMedia,
    CardContent,
    TextField,
    Button,
    Grid,
    Box,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { postTestEvent } from "../fetch/events"
import "./_styling/bookingPage.css"

const TestMakeEventPage = ({ userName }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const { description, image, name, id } = state;

    const [formData, setFormData] = useState({
        firstName: "",
        eventImage: null,
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox"
                ? checked // For checkboxes, use the 'checked' property
                : type === "file"
                    ? files[0] // For file inputs, use the first file
                    : value, // For text inputs, use the 'value' property
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const testEventData = { ...formData, arenaId: id };
    
        try {
    
          const response = await postTestEvent(testEventData);
          navigate("/arenas", { state: { eventId: response.id } });
        } catch (error) {
          console.error("Error creating booking:", error);
        }
      };

    return (
        <>
            <ArrowBackIcon className='back-arrow' onClick={() => navigate("/arenas")} />
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
                            <input
                                type="file"
                                accept="image/*"
                                name="image" // Matches the backend field
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" type="submit" color="primary">
                                Test Event
                            </Button>
                        </Grid>

                    </Grid>
                </form>

            </Box>
        </>
    );
};

export default TestMakeEventPage;