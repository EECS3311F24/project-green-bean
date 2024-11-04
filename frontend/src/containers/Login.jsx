import React, { useState } from 'react';
import "./_styling/login.css";
import { useNavigate } from 'react-router-dom';


const Login = ({setUserName}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const navigate = useNavigate();



    const handleSubmit = (event) => {
        event.preventDefault();
        const fullName = `${firstName} ${lastName}`;
        setUserName(fullName); // Set the user name in the parent component
        navigate('/arenas'); // Navigate to the arenas page
      };

    return (
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
    );
};

export default Login;