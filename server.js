require("dotenv").config();
const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const https = require("https");
const http = require("http");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const socketio = require("socket.io");
const authRouter = require("./lib/auth.router");
const passportInit = require("./lib/passport.init");
const app = express();

const users = require("./routes/api/users");
const twitter = require("./routes/api/twitter");

let server;

// If we are in production we are already running in https
if (process.env.NODE_ENV === "production") {
  server = http.createServer(app);
}
// We are not in production so load up our certificates to be able to
// run the server in https mode locally
else {
  const certOptions = {
    key: fs.readFileSync(path.resolve("certs/serverSSL.key")),
    cert: fs.readFileSync(path.resolve("certs/serverSSL.crt"))
  };
  server = https.createServer(certOptions, app);
}
// Setup for passport and to accept JSON objects
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(passport.initialize());
passportInit();

app.use(cors());

// saveUninitialized: true allows us to attach the socket id to the session
// before we have athenticated the user

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

// Connecting sockets to the server and adding them to the request
// so that we can access them later in the controller
const io = socketio(server);

app.set("io", io);

//DB config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch(err => console.log(err));

// Catch a start up request so that a sleepy Heroku instance can
// be responsive as soon as possible
app.get("/wake-up", (req, res) => res.send("👍"));

// Direct other requests to the auth router
app.use("/", authRouter);

// Use Routes
app.use("/api/users", users);
app.use("/api/twitter", twitter);

server.listen(process.env.PORT || 8080, () => {
  console.log("listening");
});
