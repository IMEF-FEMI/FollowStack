require("dotenv").config();
const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const app = express();

const users = require("./routes/api/users");
const post = require("./routes/api/post");
const auth = require("./routes/auth/twitter");
// const usersOnline = require("./routes/api/usersOnline");

// Setup for passport and to accept JSON objects
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(passport.initialize());

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

//DB config
const db = require("../config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch(err => console.log(err));

// test server connect
app.get("/wake-up", (req, res) => res.send("👍"));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

// Use Routes
app.use("/api/users", users);
app.use("/api/post", post);
app.use("/auth", auth);
// app.use("/api/users-online", usersOnline);

module.exports = app;
