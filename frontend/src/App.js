import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { useState } from "react";
import Header from "./containers/Header";
import Login from "./containers/Login";
import BookingPage from "./containers/BookingPage";
import ConfirmedBookingPage from "./containers/ConfirmedBookingPage";
import Arenas from "./containers/Arenas";

function App() {
  const [userName, setUserName] = useState("");
  return (
    <Router>
      <Header userName={userName} />
      <Routes>
        <Route path="/" element={<Login setUserName={setUserName} />} />
        <Route path="/arenas" element={<Arenas />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/confirmed" element={<ConfirmedBookingPage />} />
        <Route path="*" element={<Navigate to="/" />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;
