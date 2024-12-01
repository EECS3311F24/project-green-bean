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
import TextCommentpage from "./containers/TextComment";
import TestMakeEventPage from "./containers/testMakeEvent";
import TestGetEventsPage from "./containers/testGetEvents";
import TestSingleEventPage from "./containers/testSingleEvent";
import { useAuth } from "./state/AuthContext";
import CurrentBooking from "./containers/CurrentBooking";

function App() {
  const { userData } = useAuth();
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("userName") || "";
  });

  const [email, setEmail] = useState(() => {
    return localStorage.getItem("email") || "";
  });

  useEffect(() => {
    if (userName) {
      localStorage.setItem("userName", userName);
    }
  }, [userName]);

  useEffect(() => {
    if (email) {
      localStorage.setItem("email", email);
    }
  }, [email]);
  return (
    <Router>
      <Header
        userName={userData?.name || userName}
        setUserName={setUserName}
        setEmail={setEmail}
      />
      <Routes>
        <Route
          path="/"
          element={<Login setUserName={setUserName} setUserEmail={setEmail} />}
        />
        <Route path="/arenas" element={<Arenas />} />
        <Route
          path="/testing/:id"
          element={<TextCommentpage userName={userName} />}
        />
        <Route path="/api/auth/callback" element={<GoogleAuthCallback />} />
        <Route
          path="/booking/:id"
          element={<BookingPage userName={userData?.name || userName} />}
        />
         <Route
          path="/testEvent/:id"
          element={<TestMakeEventPage userName={userData?.name || userName} />}
        />
        <Route
        path="/testEvents"
        element={<TestGetEventsPage />}
        /><Route
        path="/testSingleEvent/:id"
        element={<TestSingleEventPage />}
        />
        <Route path="/current-booking" element={<CurrentBooking />} />
        <Route path="/confirmed" element={<ConfirmedBookingPage />} />
        <Route path="*" element={<Navigate to="/" />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;
