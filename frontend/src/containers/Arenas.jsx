import React, { useEffect, useState } from 'react';
import { fetchArenas } from '../fetch/arenas';
import emailjs from 'emailjs-com';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
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
    Modal,
    Fade,
    Backdrop,
    IconButton,
} from '@mui/material';
import FilteringComponent from './Filters';
import { useDispatch, useSelector } from 'react-redux';
import { setInitialdata } from '../store/FilterSlice';
import { useNavigate } from 'react-router-dom';


const Arenas = () => {
    const [arenas, setArenas] = useState([]);
    const [filteredArenas, setFilteredArenas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [accessibilityOpen, setAccessibilityOpen] = useState(false)
    const [contactDetails, setContactDetails] = useState({});
    const [emailStatus, setEmailStatus] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [accessibilityDetails, setAccessibilityDetails] = useState("");
    const { isAuthenticated } = useAuth();
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.filter?.data);
    const initialdata = useSelector((state) => state.filter?.initialdata);
    const navigate = useNavigate();

    // Email sending handler
    const handleSendEmail = async (e) => {
        e.preventDefault();
        
        // Reset previous statuses
        setEmailStatus(null);
        setEmailError(null);

        try {
            // EmailJS configuration
            const result = await emailjs.send(
                'service_khff1tb',     // EmailJS service ID
                'template_q0pl60c',    // EmailJS template ID
                {
                    to_email: contactDetails.contactEmail || 'prjgreenbean@gmail.com',
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                    arena_name: contactDetails.arenaName,
                },
                'I7RSpVkqUoYWttLOg'      // Replace with your EmailJS public key
            );
            setEmailStatus('Email sent successfully!');
            // Reset form after successful send
            setFormData({
                name: '',
                email: '',
                message: '',
            });
        } catch (error) {
            console.error('Email send error:', error);
            setEmailError('Failed to send email. Please try again.');
        }
    };
     // Handler for form input changes
     const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    useEffect(() => {
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
        if (isAuthenticated || localStorage.getItem('isAuthenticated') === 'true') {
            getArenas();
        } else {
            navigate('/');
        }
    }, [isAuthenticated, dispatch]);

    useEffect(() => {
        setFilteredArenas(arenas);
        setFilteredArenas((prevArenas) => {
            return prevArenas.filter((a) =>
                a.name.toLowerCase().startsWith(searchText.toLowerCase()) ||
                a.sport.toLowerCase().startsWith(searchText.toLowerCase())
            );
        });
    }, [searchText, arenas]);

 

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
}, [filters?.location]);  // Trigger when location filter changes
    

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
}, [filters?.address]);  // Trigger when address filter changes

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
}, [filters?.type]);  // Trigger when type (public/private) filter changes

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
}, [filters?.rate]);  // Trigger when rate filter changes

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
}, [filters?.rating]); // Trigger whenever `rating` or filter state changes

// Minimum Ratings Filter useEffect
useEffect(() => {
    console.log("Rate filter applied:", filters?.minAge);

    if (filters?.minAge) {
        const minRating = parseFloat(filters.minAge); // Convert filter to number

        setFilteredArenas((prevArenas) => {
            return prevArenas.filter((arena) => {
                const arenaRating = Number(arena?.minAge); // Ensure `rating` is a number
                return arenaRating >= minRating; // Compare with the minimum rating
            });
        });
    } else {
        setFilteredArenas(initialdata); // Reset to initial data if no filter is applied
    }
}, [filters?.minAge]); // Trigger whenever `minAge` or filter state changes

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">Error fetching arenas: {error}</Alert>;

    const handleBook = (arena) => {
        navigate(`/booking/${arena.id}`, {
            state: {
                description: arena.description,
                image: arena.image,
                name: arena.name,
                id: arena.id,
            }
        });
    };

    const handleContact = (arena) => {
        setContactDetails({
            contactEmail: arena.contactEmail,
            contactPhone: arena.contactPhone,
            arenaName: arena.name,
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    

    const handleAccessibilityClick = (accessibility) => {
        setAccessibilityDetails(accessibility);
        setAccessibilityOpen(true);
    };

    const closeAccessibilityModal = () => {
        setAccessibilityOpen(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Arenas
                </Typography>
                <TextField
                    variant="outlined"
                    placeholder="Search by Facility Name or Sport..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'gray', fontSize: 22 }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            searchText.length >= 1 ? (
                                <InputAdornment position="end">
                                    <CloseIcon
                                        onClick={() => setSearchText("")}
                                        sx={{ color: 'gray', fontSize: 22, cursor: 'pointer' }}
                                    />
                                </InputAdornment>
                            ) : null
                        )
                    }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: '50px' },
                        width: '500px',
                        position: 'relative',
                        marginBottom: '20px',
                    }}
                />
            </Box>
            <div className="my-2 max-w-md">
                <FilteringComponent />
            </div>
            <Grid container spacing={3}>
    {filteredArenas.map((arena) => (
        <Grid item xs={12} sm={6} md={4} key={arena.id}>
            <Card sx={{ position: 'relative' }}>
                {arena.image && (
                    <CardMedia
                        component="img"
                        height="240"
                        image={arena.image}
                        alt={arena.name}
                    />
                )}

                {/* Card Content */}
                <CardContent sx={{ position: 'relative' }}>
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

                    {/* Accessibility Icon */}
                    <img
                        src="/accessibilityIcon.png"
                        alt="Accessibility Icon"
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleAccessibilityClick(arena.accessibility)}
                    />

                    <Box display="flex" gap={2} marginTop={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleBook(arena)}
                        >
                            Book
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleContact(arena)}
                        >
                            Contact
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    ))}
</Grid>

        {/* Accessibility Modal */}
        <Modal
            open={accessibilityOpen}
            onClose={closeAccessibilityModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={accessibilityOpen}>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    padding: 4,
                    boxShadow: 24,
                    borderRadius: 1
                }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        Accessibility Information
                    </Typography>
                    <Divider sx={{ marginBottom: 2 }} />
                    <Typography>
                        {accessibilityDetails || "Accessibility details are not available."}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                        onClick={closeAccessibilityModal}
                    >
                        Close
                    </Button>
                </Box>
            </Fade>
        </Modal>

        <Modal
        open={modalOpen}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
            timeout: 500,
        }}
    >
        <Fade in={modalOpen}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    width: '500px',
                    position: 'relative',
                }}
            >
                {/* Close Icon */}
                <IconButton
                    aria-label="close"
                    onClick={closeModal}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                        padding: '4px',
                        '& .MuiSvgIcon-root': {
                            fontSize: '1.2rem'
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    Contact {contactDetails.arenaName}
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />

                {/* Existing Contact Details */}
                <Box sx={{ mb: 2 }}>
                    <Typography>
                        <strong>Phone:</strong> {contactDetails.contactPhone || 'Not Available'}
                    </Typography>
                    <Typography>
                        <strong>Email:</strong> {contactDetails.contactEmail || 'Not Available'}
                    </Typography>
                </Box>

                {/* Contact Form */}
                <form onSubmit={handleSendEmail}>
                    <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Your Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        sx={{ mb: 2 }}
                    />

                    {/* Email Status Alerts */}
                    {emailStatus && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {emailStatus}
                        </Alert>
                    )}
                    {emailError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {emailError}
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Send Message
                        </Button>
                    </Box>
                </form>
            </Box>
        </Fade>
    </Modal>
    </div>
    );
};

export default Arenas;