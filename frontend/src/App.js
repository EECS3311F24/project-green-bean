import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import Header from "./containers/Header";
import Login from "./containers/Login";
import BookingPage from "./containers/BookingPage";
import GoogleAuthCallback from "./containers/GoogleAuthCallback";
import ConfirmedBookingPage from "./containers/ConfirmedBookingPage";
import Arenas from "./containers/Arenas";
import TextCommentpage from "./containers/TextComment"
import { useAuth } from "./state/AuthContext";

function App() {
  const { userData } = useAuth();
  const [userName, setUserName] = useState(() => {
    // Check if userName exists in localStorage and use it, otherwise default to an empty string
    return localStorage.getItem("userName") || "";
  });

  useEffect(() => {
    if (userName) {
      localStorage.setItem("userName", userName);  // Store userName in localStorage
    }
  }, [userName]);  // Runs whenever userName changes
  return (
    <Router>
      <Header userName={userData?.name || userName} setUserName={setUserName} />
      <Routes>
        <Route path="/" element={<Login setUserName={setUserName} />} />
        <Route path="/arenas" element={<Arenas />} />
        <Route path="/testing/:id" element={<TextCommentpage userName={userName} />} />
        <Route path="/api/auth/callback" element={<GoogleAuthCallback />} />
        <Route path="/booking/:id" element={<BookingPage userName={userData?.name || userName} />} />
        <Route path="/confirmed" element={<ConfirmedBookingPage />} />
        <Route path="*" element={<Navigate to="/" />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;
