import React, { createContext, useState, useContext } from "react";

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null); // Store user data

  const login = (user) => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    setUserData(user); // Set user data on login
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated", "true");
    localStorage.removeItem("userName");
    setUserData(null); // Clear user data on logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
