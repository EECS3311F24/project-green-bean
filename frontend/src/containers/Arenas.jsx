import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchArenas } from '../fetch/arenas';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import { useAuth } from '../state/AuthContext';
import CloseIcon from '@mui/icons-material/Close';
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
import FilteringComponent from './Filters';
import { useDispatch, useSelector } from 'react-redux';
import { setInitialdata } from '../store/FilterSlice';

const Arenas = () => {
    const [arenas, setArenas] = useState([]);
    const [filteredArenas, setFilteredArenas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");
    const { isAuthenticated, userData } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.filter?.data);
    const initialdata = useSelector((state) => state.filter?.initialdata);
    const filterapplied = useSelector((state) => state.filter?.applied);

    console.log(filters, "filters");

    useEffect(() => {
        console.log(process.env.REACT_APP_SERVICE_ID);
        const getArenas = async () => {
            try {
                const data = await fetchArenas();
                setArenas(data);
                setFilteredArenas(data);
                dispatch(setInitialdata(data));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        if (isAuthenticated || localStorage.getItem('isAuthenticated') == 'true') {
            getArenas();
        } else {
            navigate('/');
        }
    }, [isAuthenticated, navigate, dispatch]);

    console.log(userData);

    useEffect(() => {
        setFilteredArenas(arenas);
        setFilteredArenas((prevArenas) => {
            return prevArenas.filter((a) =>
                a.location.toLowerCase().startsWith(searchText.toLowerCase()) ||
                a.sport.toLowerCase().startsWith(searchText.toLowerCase())
            );
        });
    }, [searchText, arenas]);

    useEffect(() => {
        console.log("Filters object: ", filters);
        console.log("Initial arenas list: ", arenas);
    
        if (Object.values(filters).length > 0) {
            const filtered = arenas.filter((arena) => {
                // Public/Private Filter
                const matchesType = filters?.type
                    ? (filters?.type.toLowerCase() === 'yes' && arena?.isPublic === true) ||
                      (filters?.type.toLowerCase() === 'no' && arena?.isPublic === false)
                    : true;
    
                return matchesType;
            });
    
            console.log("Filtered arenas: ", filtered);
            setFilteredArenas(filtered);
        } else {
            setFilteredArenas(initialdata);  // Reset if no filters
        }
    }, [filters, arenas]);  // Trigger when filters or arenas change

// Location Filter useEffect
useEffect(() => {
    console.log("Location filter applied:", filters?.location);
    if (filters?.location) {
        setFilteredArenas((prevArenas) => {
            return prevArenas.filter((arena) => {
                return arena?.location?.toLowerCase().includes(filters.location.toLowerCase());
            });
        });
    } else {
        setFilteredArenas(initialdata);  // Reset if no location filter
    }
}, [filters?.location, filterapplied]);  // Trigger when location filter changes
    

// Address Filter useEffect
useEffect(() => {
    console.log("Address filter applied:", filters?.address);
    if (filters?.address) {
        setFilteredArenas((prevArenas) => {
            return prevArenas.filter((arena) => {
                return arena?.address?.toLowerCase().includes(filters.address.toLowerCase());
            });
        });
    } else {
        setFilteredArenas(initialdata);  // Reset if no address filter
    }
}, [filters?.address, filterapplied]);  // Trigger when address filter changes

// Public/Private Filter useEffect
useEffect(() => {
    console.log("Public/Private filter applied:", filters?.type);
    if (filters?.type) {
        setFilteredArenas((prevArenas) => {
            return prevArenas.filter((arena) => {
                return (filters.type.toLowerCase() === 'yes' && arena?.isPublic === true) ||
                       (filters.type.toLowerCase() === 'no' && arena?.isPublic === false);
            });
        });
    } else {
        setFilteredArenas(initialdata);  // Reset if no type filter
    }
}, [filters?.type, filterapplied]);  // Trigger when type (public/private) filter changes

// Rate Filter useEffect
useEffect(() => {
    console.log("Rate filter applied:", filters?.rate);
    if (filters?.rate) {
        setFilteredArenas((prevArenas) => {
            return prevArenas.filter((arena) => {
                return arena?.rate >= filters.rate[0] && arena?.rate <= filters?.rate[1];
            });
        });
    } else {
        setFilteredArenas(initialdata);  // Reset if no rate filter
    }
}, [filters?.rate, filterapplied]);  // Trigger when rate filter changes

// Sport type Filter useEffect
useEffect(() => {
    console.log("Sport filter applied:", filters?.sport);
    if (filters?.sport) {
        const filtered = initialdata.filter((arena) =>
            arena?.sport?.toLowerCase() === filters.sport.toLowerCase()
        );
        console.log("Filtered arenas by sport:", filtered);
        setFilteredArenas(filtered);
    } else {
        setFilteredArenas(initialdata); // Reset to all arenas if no filter
    }
}, [filters?.sport, initialdata]);

// Minimum Ratings Filter useEffect
useEffect(() => {
    console.log("Rate filter applied:", filters?.rating);

    if (filters?.rating) {
        const minRating = parseFloat(filters.rating); // Convert filter to number

        setFilteredArenas((prevArenas) => {
            return prevArenas.filter((arena) => {
                const arenaRating = Number(arena?.rating); // Ensure `rating` is a number
                return arenaRating >= minRating; // Compare with the minimum rating
            });
        });
    } else {
        setFilteredArenas(initialdata); // Reset to initial data if no filter is applied
    }
}, [filters?.rating, filterapplied]); // Trigger whenever `rating` or filter state changes

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">Error fetching arenas: {error}</Alert>;

    const handleBook = (arena) => {
        console.log(arena);
        navigate(`/booking/${arena.id}`, {
            state: {
                description: arena.description,
                image: arena.image,
                name: arena.name,
                id: arena.id
            }
        }); // Pass arena details to BookingPage
    };
    return (
        <div style={{ padding: '20px' }}>
            <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Arenas
                </Typography>
                <TextField
                    variant="outlined"
                    placeholder="Search by Location or Sport..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'gray', fontSize: 22 }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            searchText.length >= 1 ?
                                <InputAdornment position="end">
                                    <CloseIcon onClick={() => setSearchText("")} sx={{ color: 'gray', fontSize: 22, cursor: 'pointer' }} />
                                </InputAdornment>
                                :
                                null
                        )
                    }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '50px',
                        },
                        width: '500px',
                        position: 'relative',
                        marginBottom: '20px',
                    }}
                />
            </Box>
            <div className='my-2 max-w-md'>
                <FilteringComponent />
            </div>
            <Grid container spacing={3}>
                {/* Display message if no arenas are found */}
                {filteredArenas.length === 0 ? (
                    <Typography variant="body1" color="textSecondary" sx={{ position: 'relative', margin: '20px', fontSize: '20px' }}>
                        No arenas found for '{searchText}'
                    </Typography>
                ) : (
                    // Display message if some but not all arenas are shown
                    filteredArenas.length !== arenas.length && (
                        <Typography variant="body1" color="textSecondary" sx={{ display: 'block', width: '100%', margin: '20px', marginBottom: '0px', fontSize: '20px' }}>
                            {filteredArenas.length} arena{filteredArenas.length > 1 ? 's' : ''} found for '{searchText}'
                        </Typography>
                    )
                )}
                {filteredArenas.map((arena) => (
                    <Grid item xs={12} sm={6} md={4} key={arena.id}>
                        <Card>
                            {arena.image && (
                                <CardMedia
                                    component="img"
                                    image={arena.image}
                                    alt={arena.name}
                                    style={{width: '100%', height: '250px'}}
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
                                    style={{ marginTop: '10px' , zIndex:'5px'}}
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