const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("./auth.controller");
const asyncHandler = require("express-async-handler");

//setting up passport middleware
const twitterAuth = passport.authenticate("twitter");
const facebookAuth = passport.authenticate("facebook");
const instagramAuth = passport.authenticate("instagram");

// Routes that are triggered by callbacks from OAuth providers once
// the user has authenticated successfully
// https://localhost:8080/api/auth/facebook/callback
router.get("/twitter/callback", twitterAuth, authController.twitter); 
router.get("/facebook/callback", facebookAuth, authController.facebook);
router.get("/instagram/callback", instagramAuth, authController.instagram);

// This custom middleware allows us to attach the socket id to the session.
// With the socket id attached we can send back the right user info to
// the right socket
router.use((req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
});

// Routes that are triggered by the React client
router.get("/twitter", twitterAuth);
router.get("/facebook", facebookAuth);
router.get("/instagram", instagramAuth);

module.exports = router;
