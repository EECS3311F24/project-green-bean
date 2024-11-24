import React, { useState } from 'react';
import './_styling/header.css'; 
import { useAuth } from '../state/AuthContext';
import { useNavigate } from 'react-router-dom';  

const Header = ({ userName, setUserName, setEmail }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // State to toggle dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to handle logout and redirect to the login page
  const handleLogout = () => {
    logout();  
    setUserName('');
    setIsDropdownOpen(false);  // Close dropdown after logout
    navigate("/login");  // Redirect to login page
  };

  // Function to handle the current booking click
  const handleCurrentBooking = () => {
    navigate("/current-booking");  // Update the path as needed
    setIsDropdownOpen(false);  // Close the dropdown after navigation
  };

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="header">
      <h1 className="project-name">Green Bean</h1>
      {(isAuthenticated || localStorage.getItem('isAuthenticated') == 'true') &&
      <div className="user-name">
        <div onClick={toggleDropdown} className="user-name-text">
          {userName} <span>&#9662;</span> {/* Downward arrow to indicate dropdown */}
        </div>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div onClick={handleCurrentBooking} className="dropdown-item">
              Current Booking
            </div>
            <div onClick={handleLogout} className="dropdown-item">
              Log Out
            </div>
          </div>
        )}
      </div>}
    </div>
  );
};

export default Header;
