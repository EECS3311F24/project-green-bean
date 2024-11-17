import React from 'react';
import './_styling/header.css'; 
import { useAuth } from '../state/AuthContext';
import { useNavigate } from 'react-router-dom';  

const Header = ({ userName, setUserName }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();  

  // Function to handle logout and redirect to the homepage
  const handleLogout = () => {
    logout();  
    setUserName('');
    navigate("/");  
  };

  return (
    <div className="header">
      <h1 className="project-name">Green Bean</h1>
      <div className="user-name">
        <div>{userName}</div>
        {(isAuthenticated || localStorage.getItem('isAuthenticated') == 'true') && <div>
            <button onClick={handleLogout} className="logout-btn">
                Log Out
            </button>
        </div>}
        
      </div>
    </div>
  );
};

export default Header;