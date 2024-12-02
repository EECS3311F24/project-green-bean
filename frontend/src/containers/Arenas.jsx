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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    FormControlLabel
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        eventTitle: '',
        description: '',
        image: null,
        date: '',
        timeFrom: '',
        timeTo: '',
        repeat: '',
        maxAge: '',
        minAge: '',
        paymentDetails: {
            creditCard: '',
        cvv: '',
        cardName: '',
        expiryDate: '',
        },
        termsAccepted: false
    });

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


    const handleInputChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleNestedInputChange = (field, nestedField, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: {
                ...prevData[field],
                [nestedField]: value,
            },
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            coverImage: e.target.files[0],
        }));
    };

    const handleChange = (e) => {
        const { name, checked } = e.target; 
        setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: checked, // Update the repeat field in the formData state
    }));
    }
    const handleCreateEvent = () => {
        if (!formData.firstName.trim() ||
            !formData.lastName.trim() ||
            !formData.phone.trim() ||
            !formData.email.trim() ||
            !formData.eventTitle.trim() ||
            !formData.description.trim() ||
            !formData.coverImage ||
            !formData.timeFrom.trim() ||
            !formData.timeTo.trim() ||
            !formData.repeat.trim() ||
            !formData.minAge.trim() ||
            !formData.maxAge.trim() ||
            !formData.termsAccepted
        ) {
            alert('Please fill out all fields and accept the terms and conditions.');
            return;
        }

        setIsModalOpen(false);
        setFormData({
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            eventTitle: '',
            description: '',
            coverImage: null,
            date: '',
            timeFrom: '',
            timeTo: '',
            isRepeat: false,
            minAge: '',
            maxAge: '',
            paymentDetails: {
                cardNumber: '',
                cvv: '',
                name: '',
                expiryDate: '',
            },
            termsAccepted: false,
        });
    };

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

    const handleTestMakeEvent = (arena) => {
        console.log(arena);
        navigate(`/testEvent/${arena.id}`, {
            state: {
                description: arena.description,
                image: arena.image,
                name: arena.name,
                id: arena.id
            }
        }); // Pass arena details to Test Event Page
    };
    return (
        <div style={{ padding: '20px' }}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setIsModalOpen(true)}
                style={{ marginBottom: '20px' }}
            >
                Create New Event
            </Button>


            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogContent>
                    {/* Contact Section */}
                    <Typography variant="h6">Contact</Typography>
                    <TextField
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Phone Number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <Typography variant="h6">Event</Typography>
                    <TextField
                        label="Event Title"
                        value={formData.eventTitle}
                        onChange={(e) => handleInputChange('eventTitle', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Cover Image
                    </Typography>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ marginTop: '10px', display: 'block' }}
                    />
                    <TextField
                        label="Minimum Age"
                        value={formData.minAge}
                        onChange={(e) => handleInputChange('minAge', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Maximum Age"
                        value={formData.maxAge}
                        onChange={(e) => handleInputChange('maxAge', e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    {/* Duration Section */}
                    <Typography variant="h6">Duration</Typography>
                    <TextField
                        label="Select Date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                    <TextField
                        label="Time From"
                        type="time"
                        value={formData.timeFrom}
                        onChange={(e) => handleInputChange('timeFrom', e.target.value)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                    <TextField
                        label="Time To"
                        type="time"
                        value={formData.timeTo}
                        onChange={(e) => handleInputChange('timeTo', e.target.value)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                    <FormControlLabel
                    control={<Checkbox name="isRepeat" checked={formData.isRepeat} onChange={handleChange} />}
                    label="Repeat Booking"
                    />
                    </div>
                        <Typography variant="h6">Payment</Typography>
                    <TextField
                        label="Credit Card Number"
                        value={formData.paymentDetails.cardNumber}
                        onChange={(e) =>
                            handleNestedInputChange('paymentDetails', 'cardNumber', e.target.value)
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="CVV"
                        value={formData.paymentDetails.cvv}
                        onChange={(e) =>
                            handleNestedInputChange('paymentDetails', 'cvv', e.target.value)
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Name on Card"
                        value={formData.paymentDetails.name}
                        onChange={(e) =>
                            handleNestedInputChange('paymentDetails', 'name', e.target.value)
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Expiry Date (MM/YY)"
                        value={formData.paymentDetails.expiryDate}
                        onChange={(e) =>
                            handleNestedInputChange('paymentDetails', 'expiryDate', e.target.value)
                        }
                        fullWidth
                        margin="normal"
                    />

                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '20px' }}>
                        By creating this event, you agree to the following terms and conditions:
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        1. The event organizer is responsible for ensuring compliance with all local laws and regulations.
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        2. The organizer agrees to provide accurate and truthful information when creating the event.
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        3. Any misuse of this platform, including fraudulent events, will result in immediate account suspension.
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        4. The platform reserves the right to remove any event that violates these terms without prior notice.
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        5. Additional terms may apply depending on the nature of the event.
                    </Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.termsAccepted}
                                onChange={(e) =>
                                    handleInputChange('termsAccepted', e.target.checked)
                                }
                            />
                        }
                        label="I have read all Terms and Conditions"
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setIsModalOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateEvent} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

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
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: '10px' , zIndex:'5px'}}
                                    onClick={() => handleTestMakeEvent(arena)}
                                >
                                    Create Event
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