const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const requireAuth = require("../../middlewares/requireAuth");
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
// Load User model
const Post = require("../../models/Post");
const User = require("../../models/User");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// @route   GET api/Post/test
// @desc    Tests Post route
// @access  Public
router.get(
  "/test",
  asyncHandler(async (req, res, next) => {
    res.json({ msg: req.user });
  })
);

router.post(
  "/add-tweet",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    // need userData for the tokens
    // tweet object for the tweet info
    // key for the corrrensponding api key
    // user_id for the post object
    // console.log("addTweet  called == user ", req.body.tweet.user);
    await User.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.body.user_id),
        points: { $gte: 50 }
      },
      {
        $inc: {
          points: -50
        }
      },
      {
        new: true
      }
    )
      .then(async user => {
        if (user) {
          const { tweet } = req.body;
          const post = await new Post({
            _owner: mongoose.Types.ObjectId(req.body.user_id),
            text: tweet.text,
            post_id: tweet.id_str,
            name: tweet.user.name,
            screen_name: tweet.user.screen_name,
            photo: tweet.user.profile_image_url_https
          });
          post.save(function(err) {
            if (err) {
              console.log(err);
              res.status(200).send({
                error: "Could Not share tweet. Try again"
              });
            } else {
              res.status(200).send({
                success: "Tweet Shared Successfully! ",
                points: user.points
              });
            }
          });
        } else {
          // user did not meet search criteria i.e not enough points
          res.status(200).send({
            error: "Not enough Points! 50 Points required"
          });
        }
      })
      .catch(e => {
        console.log(e); //user.findOneAndUpdate error
        res.status(200).send({
          error: "An error Occured try again"
          // postData: post
        });
      });
  })
);

router.delete(
  "/remove-tweet/:post_id/:user_id",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    try {
      await Post.findOneAndDelete({
        _owner: mongoose.Types.ObjectId(req.params.user_id),
        post_id: req.params.post_id
      })
        .then(post => {
          res.json({ success: "Tweet removed" });
        })
        .catch(e => {
          console.log(e);
          res.json({ error: "try again" });
        });
    } catch (e) {
      console.log(e);

      res.status(200).send({
        error: "Could not delete post. try again"
      });
    }
  })
);

// add comment
router.post(
  `/post-comment/:key`,
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.userData.accessToken,
      access_token_secret: req.body.userData.secret
    });

    // console.log("comment ", req.body.comment)
    const { tweet: data } = req.body;
    var params = {
      status: `@${data.user.screen_name} ${req.body.comment}`,
      in_reply_to_status_id: data.id_str
    };
    client.post("statuses/update", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        await User.findOneAndUpdate(
          { userid: req.body.userData.userid },
          {
            $inc: {
              points: +10
            }
          },
          {
            new: true
          }
        ).then(user => {
          if (user) {
            res.status(200).send({
              success: "👍 +10 Points Earned ",
              points: user.points
            });
          }
        });
      } else {
        // comment reply error
        console.log(error);
      }
    });
  })
);

router.post(
  `/post-like/:key`,
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.userData.accessToken,
      access_token_secret: req.body.userData.secret
    });

    // console.log("comment ", req.body.comment)
    const { tweet: data } = req.body;
    var params = {
      id: data.id_str
    };
    client.post("favorites/create", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        await User.findOneAndUpdate(
          { userid: req.body.userData.userid },
          {
            $inc: {
              points: +5
            }
          },
          {
            new: true
          }
        ).then(user => {
          if (user) {
            res.status(200).send({
              success: "👍 +5 Points Earned ",
              points: user.points
            });
          }
        });
      } else {
        // comment reply error
        console.log(error);
      }
    });
  })
);

router.post(
  `/unpost-like/:key`,
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.userData.accessToken,
      access_token_secret: req.body.userData.secret
    });

    // console.log("comment ", req.body.comment)
    const { tweet: data } = req.body;
    var params = {
      id: data.id_str
    };
    client.post("favorites/destroy", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        await User.findOneAndUpdate(
          { userid: req.body.userData.userid },
          {
            $inc: {
              points: -5
            }
          },
          {
            new: true
          }
        ).then(user => {
          if (user) {
            res.status(200).send({
              success: "👎 5 Points Deducted",
              points: user.points
            });
          }
        });
      } else {
        // comment reply error
        console.log(error);
      }
    });
  })
);

router.post(
  `/post-retweet/:key`,
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.userData.accessToken,
      access_token_secret: req.body.userData.secret
    });

    // console.log("comment ", req.body.comment)
    const { tweet: data } = req.body;
    var params = {
      id: data.id_str
    };
    client.post("statuses/retweet", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        await User.findOneAndUpdate(
          { userid: req.body.userData.userid },
          {
            $inc: {
              points: +20
            }
          },
          {
            new: true
          }
        ).then(user => {
          if (user) {
            res.status(200).send({
              success: "👍 +20 Points Earned",
              points: user.points
            });
          }
        });
      } else {
        // comment reply error
        console.log(error);
      }
    });
  })
);

router.post(
  `/unpost-retweet/:key`,
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.userData.accessToken,
      access_token_secret: req.body.userData.secret
    });

    // console.log("comment ", req.body.comment)
    const { tweet: data } = req.body;
    var params = {
      id: data.id_str
    };
    client.post("statuses/unretweet", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        await User.findOneAndUpdate(
          { userid: req.body.userData.userid },
          {
            $inc: {
              points: -20
            }
          },
          {
            new: true
          }
        ).then(user => {
          if (user) {
            res.status(200).send({
              success: "👎 20 Points Deducted",
              points: user.points
            });
          }
        });
      } else {
        // comment reply error
        console.log(error);
      }
    });
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

    // here i added the user_id to the userData obj
    const posts = await Post.find({
      _owner: mongoose.Types.ObjectId(req.body.user_id)
    });
    const page = req.params.page === 0 ? 1 : parseInt(req.params.page) + 1;
    var params = {
      user_id: req.body.userid,
      count: 20 * page
    };
    
    console.log("tweets to retrieve ", params.count);
    client.get("statuses/user_timeline", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        const allTweet = Object.keys(tweet).map(i => tweet[i]);
        const tweetForPage = allTweet.slice(req.body.recievedTweets, 20 * page);
        console.log("Tweets retrieved ", allTweet.length);

        if (
          parseInt(page) > 1 &&
          tweetForPage.length !== 0 &&
          req.body.recievedTweets !== 0
        ) {
          if (posts.length !== 0) {
            posts.map(post => {
              tweetForPage.map(tweet => {
                if (post.post_id === tweet.id_str) {
                  // chcking for tweets that user has already added to db
                  tweet.added = true;
                }
              });
            });
            return res.send(tweetForPage);
          }
          res.send(tweetForPage);
        } else if (parseInt(page) === 1) {
          if (posts.length !== 0) {
            posts.map(post => {
              allTweet.map(tweet => {
                if (post.post_id === tweet.id_str) {
                  tweet.added = true;
                }
              });
            });
            return res.send(allTweet);
          }
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

router.post(
  "/get-main-tweets/:key/:page",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.accessToken,
      access_token_secret: req.body.secret
    });

    try {
      const { page } = req.params;

      const posts = await Post.find({})
        .sort({ createdAt: -1 })
        .limit(12)
        .skip(12 * page)
        // .populate({
        //   path: "_owner",
        //   select: "profilePhoto displayName"
        // })
        .exec();
      // console.log(posts)
      let post_ids = "";
      for (var i = 0; i < posts.length; i++) {
        if (i === posts.length - 1) {
          post_ids += posts[i].post_id;
        } else {
          post_ids += `${posts[i].post_id},`;
        }
      }
      var params = {
        id: post_ids
      };
      client.get("statuses/lookup", params, async function(
        error,
        tweet,
        response
      ) {
        if (!error && response.statusCode === 200) {
          res.send(tweet);
        } else {
          console.log(error);
        }
      });
    } catch (e) {
      console.log(e);
    }
  })
);
module.exports = router;
