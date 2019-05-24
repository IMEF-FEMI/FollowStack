const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const requireAuth = require("../../middlewares/requireAuth");
var Twitter = require("twitter");
var moment = require("moment");
var async = require("async");
const axios = require("axios");
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
// Load User model
const Follows = require("../../models/Follows");
const User = require("../../models/User");

// @route   GET api/Post/test
// @desc    Tests Post route
// @access  Public
router.get(
  "/test/:key",
  asyncHandler(async (req, res, next) => {
    console.log("test works with key ", req.params.key);

    res.json({ msg: "Post works" });
  })
);

router.post(
  "/get-profile-tweets/:key/:page",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.accessToken,
      access_token_secret: req.body.secret
    });
    const page = req.params.page === 0 ? 1 : parseInt(req.params.page) + 1;
    var params = {
      user_id: req.body.userid,
      count: 12 * page
    };
    //    strip array of first 12 * page element, return remaining
    console.log("tweets to retrieve ", params.count);
    client.get("statuses/user_timeline", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        const allTweet = Object.keys(tweet).map(i => tweet[i]);
        const tweetForPage = allTweet.slice(req.body.recievedTweets, 12 * page);
        console.log("Tweets retrieved ", allTweet.length);

        if (parseInt(page) > 1 && tweetForPage.length !== 0) {
          if (req.body.recievedTweets !== 0) {
            res.send(tweetForPage);
          }
        } else if (parseInt(page) === 1) {
          res.send(allTweet);
        } else if (tweetForPage.length === 0) {
          res.send();
        }
      } else {
        console.log(error);
      }
    });
  })
);

module.exports = router;
