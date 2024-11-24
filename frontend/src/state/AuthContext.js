import React, { createContext, useState, useContext } from "react";

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null); // Store user data

  const login = (user) => {
    setIsAuthenticated(true);
    console.log(user);
    if (user && user.email && !localStorage.getItem("email")) {
      localStorage.setItem("email", user.email);
    }
    if (user && user.name) {
      localStorage.setItem("userName", user.name);
    }

    localStorage.setItem("isAuthenticated", "true");
    setUserData(user);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated", "true");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    setUserData(null);
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
