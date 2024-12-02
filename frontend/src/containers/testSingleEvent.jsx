import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Typography,
    Card,
    CardMedia,
    CardContent, 
    Box,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchEvents } from "../fetch/events"
import "./_styling/bookingPage.css"

const TestGetSingleEvent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const{description,
        image,
        name,
        id,
        arenaId} = state;



   

   

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
               <Card sx={{ mb: 2 }}>
                            <CardMedia component="img" height="240" image={image} />
                            <CardContent>
                                <Typography>{arenaId}</Typography>
                            </CardContent>
                        </Card>

            </Box>
        </>
    );

}

export default TestGetSingleEvent;