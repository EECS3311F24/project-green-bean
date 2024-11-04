import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate
import { fetchArenas } from '../fetch/arenas';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    Button
} from '@mui/material';

const Arenas = () => {
    const [arenas, setArenas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const getArenas = async () => {
            try {
                const data = await fetchArenas();
                setArenas(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getArenas();
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">Error fetching arenas: {error}</Alert>;

    const handleBook = (arena) => {
        console.log(arena);
        navigate(`/booking/${arena.id}`, { state: { 
            description: arena.description, 
            image: arena.image,
            name: arena.name,
            id: arena.id
        }}); // Pass arena details to BookingPage
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Arenas
            </Typography>
            <Grid container spacing={3}>
                {arenas.map((arena) => (
                    <Grid item xs={12} sm={6} md={4} key={arena.id}>
                        <Card>
                            {arena.image && (
                                <CardMedia
                                    component="img"
                                    height="240"
                                    image={arena.image}
                                    alt={arena.name}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {arena.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Location: {arena.location}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Address: {arena.address}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Public: {arena.isPublic ? 'Yes' : 'No'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Capacity: {arena.capacity}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Rate: ${arena.rate}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Rating: {arena.rating} ⭐
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    style={{ marginTop: '10px' }}
                                    onClick={() => handleBook(arena)} 
                                >
                                    Book
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default Arenas;
