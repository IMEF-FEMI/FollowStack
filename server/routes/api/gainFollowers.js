const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const requireAuth = require("../../middlewares/requireAuth");
const { RateLimiterMemory } = require("rate-limiter-flexible");
var Twitter = require("twitter");
var async = require("async");
var url = require("url");

// multer upload imports
const path = require("path");
const fs = require("fs");

const { flagTokensAsExpired, friendshipLookup } = require("../../utils/gainFollowersUtil");

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
  },
  {
    consumerKey: process.env.TWITTER_APP_DEV_KEY,
    consumerSecret: process.env.TWITTER_APP_DEV_SECRET
  }
];
// Load model
const Post = require("../../models/Post");
const User = require("../../models/User");
const UserKeys = require("../../models/UserKeys");

const followRateLimiter = new RateLimiterMemory({
  points: 25, // 20 points
  duration: 60 * 60 * 24
});
const unFollowRateLimiter = new RateLimiterMemory({
  points: 24, // 20 points
  duration: 60 * 60 * 24
});

const rateLimiterMiddleware = (req, res, next) => {
  followRateLimiter
    .consume(req.user.userid)
    .then(() => {
      next();
    })
    .catch(_ => {
      res.status(429).send("Too Many Requests");
    });
};

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// @route   GET api/Post/test
// @desc    Tests Post route
// @access  Public
router.get(
  "/test",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    res.json({ msg: req.user });
  })
);

// limits user follows to 25 per day
// adds counter for users follow back sets limit to 24 per day and set setToken as expired on the 25th
// although when user logs in it removes the token from bieng expired
// and still has a chance of bieng followed once dat day
router.post(
  "/follow/:key",
  requireAuth,
  rateLimiterMiddleware,
  asyncHandler(async (req, res, next) => {
    console.log("following");
    const random = TWITTER_KEYS[req.params.key];

    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.userData.accessToken,
      access_token_secret: req.body.userData.secret
    });
    var params = {
      user_id: req.body.newUser.user_id
    };
    client.post("friendships/create", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        //  init follow back
        await UserKeys.findOne({ user_id: req.body.newUser.user_id }).then(
          user => {
            if (user) {
              unFollowRateLimiter
                .consume(req.body.newUser.user_id) // consume 2 points
                .then(rateLimiterRes => {
                  // get followed user credentials
                  // to initiate instant follow back

                  const random = TWITTER_KEYS[parseInt(user.key)];
                  client = new Twitter({
                    consumer_key: random.consumerKey,
                    consumer_secret: random.consumerSecret,
                    access_token_key: user.accessToken,
                    access_token_secret: user.secret
                  });
                  params = {
                    user_id: req.user.userid
                  };

                  
                  client.post("friendships/create", params, async function(
                    error,
                    tweet,
                    response
                  ) {
                    if (!error && response.statusCode === 200) {
                      res.status(200).send({ success: "user followed" });
                    } else {
                      // token is probably expired
                      // flag tokens as expired
                      flagTokensAsExpired(req.body.newUser);
                      res.status(200).send({ error: error[0].message });
                    }
                  });
                })
                .catch(rateLimiterRes => {
                  // Not enough points to consume
                  flagTokensAsExpired(req.body.newUser);
                });
            }
          }
        );
      } else {
        console.log(error);
        res.status(200).send({ error: error[0].message });
      }
    });
  })
);

router.post(
  "/unfollow/:key",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    console.log("unfollowing");
    const random = TWITTER_KEYS[req.params.key];

    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.userData.accessToken,
      access_token_secret: req.body.userData.secret
    });
    var params = {
      user_id: req.body.newUser.user_id
    };
    client.post("friendships/destroy", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        //  init follow back
        await UserKeys.findOne({ user_id: req.body.newUser.user_id }).then(
          user => {
            if (user) {
              // get followed user credentials
              // to initiate instant follow back
              const random = TWITTER_KEYS[parseInt(user.key)];
              client = new Twitter({
                consumer_key: random.consumerKey,
                consumer_secret: random.consumerSecret,
                access_token_key: user.accessToken,
                access_token_secret: user.secret
              });
              params = {
                user_id: req.user.userid
              };
              client.post("friendships/destroy", params, async function(
                error,
                tweet,
                response
              ) {
                if (!error && response.statusCode === 200) {
                  res.status(200).send({ success: "user unfollowed" });
                } else {
                  // token is probably expired
                  // flag tokens as expired
                  flagTokensAsExpired(req.body.newUser);
                  res.status(200).send({ error: error[0].message });
                }
              });
            }
          }
        );
      } else {
        console.log(error);
        res.status(200).send({ error: error[0].message });
      }
    });
  })
);

router.post(
  "/get-users/:key",
  requireAuth,
  asyncHandler(async (req, res, next) => {

    // get 15 active(token_expired = fallse) users at random and get friendship status
    const users = await User.aggregate([
      { $match: { token_expired: false } },
      { $sample: {size: 15} },
    ]).exec();

  friendshipLookup(req.body.userData, req.params.key, users, arr=>{
       // identify those already followed
    arr.map(i => {
      users.map(j => {
        if (i.id_str === j.user_id) {
          if (
            i.connections[0] === "following" ||
            i.connections[1] === "following"
          ) {
            j.following = true;
          } else {
            j.following = false;
          }
        }
      });
    });
    res.status(200).send({ users: users });
    })

  }))

module.exports = router;
