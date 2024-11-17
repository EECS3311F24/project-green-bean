var createError = require("http-errors");
require("dotenv").config();
var express = require("express");
var path = require("path");
const PORT = process.env.PORT;
const { Server } = require("socket.io");
const http = require("http");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public/stylesheets')));

// initial startup config
require("./startup/middlewares")(app);
require("./startup/routes")(app);
require("./startup/db");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Create HTTP server and bind Socket.IO to it
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow cross-origin requests (adjust for security in production)
  },
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Pass `io` to the feedback routes for emitting events
app.set("socketio", io);

// const server = app.listen(PORT, () =>
//   console.log(`Listening on port ${PORT}... `)
// );
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

module.exports = server;
