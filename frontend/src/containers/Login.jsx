import React, { useState } from 'react';
import "./_styling/login.css";
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../state/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';


const Login = ({setUserName}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();
      
    const handleGoogleSignIn = async () => {
        try {
          // Fetch the Google OAuth URL from your backend
          const response = await fetch("http://localhost:3000/api/auth/google", {
            method: "POST",
          });
    
          const data = await response.json();
          if (data.url) {
            // Redirect the user to the Google SignIn page
            window.location.href = data.url;
          } else {
            console.error("Failed to get the Google OAuth URL.");
          }
        } catch (error) {
          console.error("Error during Google Sign-In:", error);
        }
      };
      

    const handleSubmit = (event) => {
        event.preventDefault();
        setUserName(`${firstName} ${lastName}`);
        login();
        navigate('/arenas'); // Navigate to the arenas page
      };

    return (
        <>
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit">Login</button>
            </form>
            
        </div>
        <div className="horizontal-bar">
          <span>OR</span>
        </div>
        <div className="google-signin-container">
        <button className="google-signin-btn" onClick={() => handleGoogleSignIn()}>
       
        <GoogleIcon style={{position: 'relative', marginRight: '10px'}}/>
      
            Sign in with Google
        </button>
        </div>
        </>
    );
};

export default Login;