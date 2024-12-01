import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Typography,
    Card,
    CardMedia,
    CardContent, 
    Box,
    Button
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchEvents } from "../fetch/events"
import "./_styling/bookingPage.css"

const TestGetEvents = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;

    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEventsData = async () => {
            try {
                const data = await fetchEvents();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching feedback:", error);
            }
        };

        fetchEventsData();
    }, []);

    useEffect(() => {
        console.log(events); // Logs when `events` changes
    }, [events]);

    const handleDisplayEvent = (event) => {
        console.log(event);
        navigate(`/testSingleEvent/${event.id}`, {
            state: {
                description: event.eventDescription,
                image: event.eventImage,
                name: event.eventTitle,
                id: event.id,
                arenaId: event.arenaId
            }
        }); // Pass arena details to BookingPage
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
                {events.length > 0 ? (
                    events.map((item, index) => (
                        <Card key={item.id || index} sx={{ mb: 2 }}>
                            <CardMedia component="img" height="240" image={item.eventImage} />
                            <CardContent>
                                <Typography>{item.eventTitle}</Typography>
                            </CardContent>
                            <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: '10px' , zIndex:'5px'}}
                                    onClick={() => handleDisplayEvent(item)}
                                >
                                    View Event
                                </Button>
                        </Card>
                        
                    ))
                ) : (
                    <Typography>No events available</Typography>
                )}

            </Box>
        </>
    );

}

export default TestGetEvents;