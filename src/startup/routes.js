const express = require("express");
const testing = require("../routes/testRoute");
const arenas = require("../routes/arenas");
const bookings = require("../routes/bookings");
const users = require("../routes/users");
const auth = require("../routes/auth");
const cors = require("cors");
const error = require("../middleware/error");

const corsOptions = {
  origin: "http://localhost:3001", // Set the exact origin of your frontend
  credentials: true, // Allow cookies and credentials to be included
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers (e.g., for Authorization)
};

module.exports = function (app) {
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use("/api/testing", testing);
  app.use("/api/arenas", arenas);
  app.use("/api/bookings", bookings);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};