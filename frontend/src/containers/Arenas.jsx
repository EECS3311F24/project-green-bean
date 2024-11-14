import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchArenas } from '../fetch/arenas';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import {useAuth} from '../state/AuthContext';
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
    const {isAuthenticated, userData } = useAuth();
    const navigate = useNavigate();

    const dispatch = useDispatch()
    const filters = useSelector((state) => state.filter?.data)
    const initialdata = useSelector((state) => state.filter?.initialdata)
    const filterapplied = useSelector((state)=> state.filter?.applied)

    console.log(filters, "filters")

    useEffect(() => {
        console.log(userData);
        if (isAuthenticated) {
            const getArenas = async () => {
                try {
                    const data = await fetchArenas();
                    setArenas(data);
                    setFilteredArenas(data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };
            getArenas();
        } 
        else {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        setFilteredArenas(arenas);
        setFilteredArenas(prevArenas => {
            const arenas = prevArenas.filter((a) =>
                a.location.toLowerCase().startsWith(searchText.toLowerCase()) || a.sport.toLowerCase().startsWith(searchText.toLowerCase())
            );

            return arenas;
        });
    }, [searchText]);

    useEffect(() => {
        console.log("called", filterapplied, initialdata)
        if(Object.values(filters).length > 0){
            setFilteredArenas(() => {
                return arenas.filter((arena) => {
                    const matchesLocation = filters?.location
                        ? arena?.location?.toLowerCase().startsWith(filters.location.toLowerCase())
                        : true;
    
                    const matchesAddress = filters?.address
                        ? arena?.address?.toLowerCase().includes(filters.address.toLowerCase())
                        : true;

                       
    
                    const matchesType = filters?.type
                        ? arena?.isPublic === (filters.type.toLowerCase() === 'yes' ? true :false)
                        : true;
    
                    // const matchesRating = filters?.rating
                    //     ? parseFloat(arena?.rating) >= parseFloat(filters?.rating)
                    //     : true;
    
                    const matchesRate = filters?.rate
                        ? arena?.rate >= filters.rate[0] && arena?.rate <= filters?.rate[1]
                        : true;
    
                    return (
                        matchesLocation &&
                        matchesAddress &&
                        matchesType  &&
                        // matchesRating &&
                        matchesRate
                    );
                });
            });
        }else{
            setFilteredArenas(initialdata)
            setArenas(initialdata)
        }
       
    }, [filterapplied]);

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
