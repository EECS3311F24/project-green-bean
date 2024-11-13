const express = require("express");
const testing = require("../routes/testRoute");
const arenas = require("../routes/arenas");
const bookings = require("../routes/bookings");
const feedback = require("../routes/feedback");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/testing", testing);
  app.use("/api/arenas", arenas);
  app.use("/api/bookings", bookings);
  app.use("/api/feedback", feedback);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
