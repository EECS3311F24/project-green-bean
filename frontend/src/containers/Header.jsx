
import React from 'react';
import './_styling/header.css'; 

const Header = ({ userName }) => {
  return (
    <div className="header">
      <h1 className="project-name">Green Bean</h1>
      <div className="user-name">{userName}</div>
    </div>
  );
};

export default Header;
