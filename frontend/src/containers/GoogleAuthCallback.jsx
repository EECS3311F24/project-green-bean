import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../state/AuthContext';

const GoogleAuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  useEffect(() => {
    const handleGoogleCallback = async () => {
      // Get the code from the URL query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code'); // Google will send the code here
      if (code) {
        try {
          const response = await fetch(`http://localhost:3000/api/auth/callback?code=${code}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();
          if (response.ok) {
            // Store user data in Context and log in the user
            login(data);  // Pass the received user data to login

            console.log('Authenticated successfully:', data);
            navigate('/arenas'); // Navigate to another page after successful authentication
          } else {
            console.error('Error during authentication:', data);
            navigate('/'); // Redirect to the login page in case of error
          }
        } catch (error) {
          console.error('Error during authentication:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleGoogleCallback();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <p>Processing your login...</p>
    </div>
  );
};

export default GoogleAuthCallback;