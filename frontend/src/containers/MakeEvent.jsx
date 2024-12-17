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
    FormControlLabel,
    Checkbox,

} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { postEvent } from "../fetch/events"
import "./_styling/bookingPage.css"

const MakeEvents = ({ userName }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const { description, image, name, id } = state;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        arenaName: name,
        email: '',
        eventTitle: '',
        eventDescription: '',
        eventImage: null,
        date: '',
        time: '',
        isRepeat: false,
        maxAge: '',
        minAge: '',
        paymentInfo: {
            cardName: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
        }
    });

    const [termsAccepted, setTermsAccepted] = useState(false);

    // const handleChange = (e) => {
    //     const { name, value, type, checked, files } = e.target;
    //     if (name.startsWith("paymentInfo.")) {
    //         const paymentField = name.split(".")[1];
    //         setFormData((prev) => ({
    //             ...prev,
    //             paymentInfo: {
    //                 ...prev.paymentInfo,
    //                 [paymentField]: value,
    //             },
    //         }));
    //     } else {
    //         setFormData((prev) => ({
    //             ...prev,
    //             [name]: type === "checkbox"
    //                 ? checked // For checkboxes, use the 'checked' property
    //                 : type === "file"
    //                     ? files[0] // For file inputs, use the first file
    //                     : value, // For text inputs, use the 'value' property
    //         }));
    //     };
    // }

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        // Handle payment fields (nested inside paymentInfo)
        if (name.startsWith("paymentInfo.")) {
            const paymentField = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                paymentInfo: {
                    ...prev.paymentInfo,
                    [paymentField]: value,
                },
            }));
        } else {
            if (type === "file" && name === "eventImage" && files[0]) {
                const file = files[0];
                // Check if the file is an image
                if (!file.type.startsWith("image/")) {
                    alert("Please select a valid image file");
                    return;
                }
                // Update the formData with the selected file
                setFormData((prev) => ({
                    ...prev,
                    [name]: file,
                }));
            } else {
                // Handle other inputs (checkboxes, text fields)
                setFormData((prev) => ({
                    ...prev,
                    [name]: type === "checkbox"
                        ? checked // For checkboxes, use the 'checked' property
                        : value,  // For text inputs, use the 'value' property
                }));
            }
        }
    };


    const handleCheckedChange = (event) => {
        setTermsAccepted(event.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        console.log(termsAccepted)

        const eventData = { ...formData, arenaId: id };

        try {

            const response = await postEvent(eventData);
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
                    Creating Event for {name}
                </Typography>
                <Card sx={{ mb: 5 }}>
                    <CardMedia component="img" height="240" image={image} alt={name} />
                    <CardContent>
                        <Typography>Description: {description}</Typography>
                    </CardContent>
                </Card>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Contact Section */}
                        <Typography variant="h6">Contact</Typography>
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Phone Number"
                            name="phoneNumber"
                            value={formData.phone}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />

                        <Typography variant="h6">Event</Typography>
                        <TextField
                            label="Event Title"
                            name="eventTitle"
                            value={formData.eventTitle}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                         <Typography variant="h6">Event Description</Typography>
                        <textarea
                            label="Description"
                            id="eventDescription"
                            name="eventDescription"
                            value={formData.eventDescription}
                            onChange={handleChange}
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '8px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                resize: 'vertical'
                            }}
                        />
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Cover Image
                        </Typography>
                        <input
                            type="file"
                            accept="image/*"
                            name="eventImage"// Matches the backend field
                            onChange={handleChange}
                            style={{ marginTop: '10px', display: 'block' }}
                        />
                        <TextField
                            label="Minimum Age"
                            name="minAge"
                            value={formData.minAge}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Maximum Age"
                            name="maxAge"
                            value={formData.maxAge}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />

                        {/* Duration Section */}
                        <Typography variant="h6">Duration</Typography>
                        <TextField
                            label="Select Date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Time"
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                            <FormControlLabel
                                control={<Checkbox name="isRepeat" checked={formData.isRepeat} onChange={handleChange} />}
                                label="Repeat Booking"
                            />
                        </div>
                        <Typography variant="h6">Payment</Typography>
                        <TextField
                            label="Card Number"
                            name="paymentInfo.cardNumber"
                            value={formData.paymentInfo.cardNumber}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField

                            label="CVV"
                            name="paymentInfo.cvv"
                            value={formData.paymentInfo.cvv}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Cardholder Name"
                            name="paymentInfo.cardName"
                            value={formData.paymentInfo.name}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Expiry Date (MM/YY)"
                            name="paymentInfo.expiryDate"
                            value={formData.paymentInfo.expiryDate}
                            onChange={handleChange}
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
                                    checked={termsAccepted}
                                    onChange={handleCheckedChange}

                                />
                            }
                            label="I have read all Terms and Conditions"
                        />
                        <Grid item xs={12}>
                            <Button variant="contained" type="submit" color="primary">
                                Make Event
                            </Button>
                        </Grid>

                    </Grid>
                </form>

            </Box>
        </>
    );
};


export default MakeEvents;