require("dotenv").config();
const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const app = express();

const users = require("./routes/api/users");
const post = require("./routes/api/post");
const usersOnline = require("./routes/api/usersOnline");

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
// app.use("/", authRouter);

// Use Routes
app.use("/api/users", users);
app.use("/api/post", post);
app.use("/api/users-online", usersOnline);

app.listen(process.env.PORT || 8080, () => {
  console.log("listening");
});
