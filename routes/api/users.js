const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const keys = require("../../config/keys");

// Load User && Follows model
const User = require("../../models/User");
const Follows = require("../../models/Follows");

var Twitter = require("twitter");
const TWITTER_KEYS = [
  {
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET
  },
  {
    consumerKey: process.env.TWITTER_APP_KEY,
    consumerSecret: process.env.TWITTER_APP_SECRET
  },
  {
    consumerKey: process.env.TWITTER_APP_ONE_KEY,
    consumerSecret: process.env.TWITTER_APP_ONE_SECRET
  },
  {
    consumerKey: process.env.TWITTER_APP_TWO_KEY,
    consumerSecret: process.env.TWITTER_APP_TWO_SECRET
  }
];

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

//register end-point
router.post(
  "/register",
  asyncHandler(async (req, res, next) => {
    // expiration time
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24; 
    const week = day * 7;
    var error = {};
    await User.findOne({
      userid: req.body.userid,
      username: req.body.username
    }).then(user => {
      if (user) {
        error.userError = "User already exist";
        return res.status(400).json(error);
      } else {
        const newUser = new User({
          username: req.body.username,
          userid: req.body.userid,
          location: req.body.location
        });

        newUser
          .save()
          .then(user => {
            Promise.all([
            new Follows({
              username: req.body.username,
              user_id: req.body.userid
            }).save()
          ])

            const payload = {
              userid: user.userid
            };
            // Sign Token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: week },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              }
            );
          })
          .catch(err => console.log(err));
      }
    });
  })
);

//login endpoint
router.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    // expiration time
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    await User.findOne({ userid: req.body.userid })
      .then(user => {
        if (user) {
          const payload = {
            userid: user.userid
          };
          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: week },
            (err, token) => {
              console.log("token " + token);
              console.log("user " + user);
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        }
      })
      .catch(err => console.log(err));
  })
);

// check if user exists
router.get(
  "/check-user/:id",
  asyncHandler(async (req, res, next) => {
    await User.findOne({
      userid: req.params.id
    })
      .then(user => {
        if (user) {
          res.json(true);
          console.log(true);
        } else {
          res.json(false);
          console.log(false);
        }
      })
      .catch(err => console.log(err));
  })
);

router.post(
  "/get-profile",
  asyncHandler(async (req, res, next) => {
   
    const random = TWITTER_KEYS[0];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.accessToken,
      access_token_secret: req.body.secret
    });
    const params = {
      user_id: req.body.userid
    };
    
    client.get("users/show", params, function(
      error,
      profile,
      response
    ) {
      if (!error && response.statusCode === 200) {
        client = null
        res.status(200).json({
          name: profile.name,
          screen_name: profile.screen_name,
          description: profile.description, 
          followers: profile.followers_count,
          following: profile.friends_count,
          photo: profile.profile_image_url.replace("_normal", "")
        })
        
      } else {
        // either has an error or returned status code not equals 200
        console.log(error);
      }
    });

  })
);

module.exports = router;
