const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const requireAuth = require("../../middlewares/requireAuth");
var Twitter = require("twitter");
var moment = require("moment");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

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
const UsersOnline = require("../../models/UsersOnline");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// @route   GET api/twitter/test
// @desc    Tests twitter route
// @access  Public
router.get(
  "/test",
  asyncHandler(async (req, res, next) => {
    res.json({ msg: "works" });
  })
);
router.get(
  "/check-followings/:id",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    // check if user has followings
    await UsersOnline.findOne({ user_id: req.params.id }).then(user => {
      if (user) {
        res.json({
          hasFollowings: user.following.length !== 0,
          date:
            user.following[user.following.length - 1] === undefined
              ? ""
              : user.following[user.following.length - 1].date - Date.now(),
          followings: user.following
        });
      }
    });
  })
);

router.post(
  "/get-followed-back/:key",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];

    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.accessToken,
      access_token_secret: req.body.secret
    });

    await UsersOnline.findOne({ user_id: req.body.userid }).then(user => {
      if (user.following.length !== 0) {
        var arr = user.following;
        // arrange the id's as a coma seperated list
        // for the call to twitter api
        let user_ids = "";
        for (var i = 0; i < arr.length; i++) {
          if (i === arr.length - 1) {
            user_ids += arr[i].user_id;
          } else {
            user_ids += `${arr[i].user_id},`;
          }
        }
        var params = {
          user_id: user_ids
        };
        client.get("friendships/lookup", params, function(
          error,
          tweet,
          response
        ) {
          if (!error && response.statusCode === 200) {
            // convert the returned json to array of json objects
            //  const arr =  Object.values(tweet)
            const arr = Object.keys(tweet).map(i => tweet[i]);
            var followedBack = [];

            // get those accts with "connections": ["following","followed_by"]
            // they are the ones that followed back
            arr.map(i => {
              if (i.connections[1]) {
                // get original data from our following list
                user.following.map(j => {
                  if (i.id_str === j.user_id) {
                    followedBack.push(j);
                  }
                });
              }
            });
            client = null;
            res.status(200).send(followedBack);
          } else {
            // either has an error or returned status code not equals 200
            console.log(error);
          }
        });
      } else {
        // the following list is empty
        client = null;
        res.status(200).send([]);
      }
    });
  })
);
router.post(
  "/get-unfollow-list/:key",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];

    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.accessToken,
      access_token_secret: req.body.secret
    });

    await UsersOnline.findOne({ user_id: req.body.userid }).then(user => {
      if (user.following.length !== 0) {
        var arr = user.following;
        // arrange the id's as a coma seperated list
        // for the call to twitter api
        let user_ids = "";
        for (var i = 0; i < arr.length; i++) {
          if (i === arr.length - 1) {
            user_ids += arr[i].user_id;
          } else {
            user_ids += `${arr[i].user_id},`;
          }
        }
        var params = {
          user_id: user_ids
        };
        client.get("friendships/lookup", params, function(
          error,
          tweet,
          response
        ) {
          if (!error && response.statusCode === 200) {
            // convert the returned json to array of json objects
            //  const arr =  Object.values(tweet)
            const arr = Object.keys(tweet).map(i => tweet[i]);
            var unFollowList = [];

            // get those accts with "connections": ["following","followed_by"]
            // they are the ones that followed back
            arr.map(i => {
              if (i.connections[1] !== "followed_by" ) {
                // get original data from our following list
                user.following.map(j => {
                  if (i.id_str === j.user_id) {
                    unFollowList.push(j);
                  }
                });
              }
            });
            client = null;
            res.status(200).send(unFollowList);
          } else {
            // either has an error or returned status code not equals 200
            console.log(error);
          }
        });
      } else {
        // the following list is empty
        client = null;
        res.status(200).send([]);
      }
    });
  })
);

router.post(
  "/follow",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    var userObj = {
      user_id: req.body.newUser.user_id,
      name: req.body.newUser.name,
      screen_name: req.body.newUser.screen_name,
      photo: req.body.newUser.photo
    };
    UsersOnline.findOneAndUpdate(
      { user_id: req.body.userData.userid },
      { $addToSet: { following: userObj } },
      { new: true }
    )
      .then(user => {
        res.status(200).send({ res: "user followed" });
      })
      .catch(err => console.log(err));
  })
);

router.post(
  "/unfollow",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    var userObj = {
      user_id: req.body.newUser.user_id,
      name: req.body.newUser.name,
      screen_name: req.body.newUser.screen_name,
      photo: req.body.newUser.photo
    };
    UsersOnline.findOneAndUpdate(
      { user_id: req.body.userData.userid },
      { $pull: { following: userObj } },
      { new: true }
    )
      .then(user => {
        res.status(200).send({ res: "user unfollowed" });
      })
      .catch(err => console.log(err));
  })
);

router.post(
  "/finish-unfollow",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    UsersOnline.findOneAndUpdate(
      { user_id: req.body.userData.userid },
      { $set: { following: [] } }
    ).then(user=>{
      res.status(200).json({res: "done"})
    }).catch(err => console.log(err));
  })
);

router.post(
  "/get/:key",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.accessToken,
      access_token_secret: req.body.secret
    });

    client.get("statuses/home_timeline", function(error, tweets, response) {
      if (!error) {
        var lastHourTweets = [];
        var lastHourTweetsArrayIndex = 0;
        var userArr = [];
        error = {};
        for (var i = 0; i < tweets.length; i++) {
          // check if tweet is less than one hour old
          const isLessThanOneHour = moment(
            tweets[i].created_at,
            "ddd MMM DD HH:mm:ss Z YYYY"
          ).isAfter(moment().subtract(1, "hours"));
          if (isLessThanOneHour) {
            // add to array
            lastHourTweets[lastHourTweetsArrayIndex] = {
              id_str: tweets[i].id_str,
              screen_name: tweets[i].user.screen_name
            };
            lastHourTweetsArrayIndex++;
          }
        }
        if (lastHourTweets.length === 0) {
          // console.log("last hour tweets === 0");

          error.newFollowersError =
            "Error Getting Online Users Try Again Later.";
          return res.status(500).json(error);
        }
        for (var i = 0; i < lastHourTweets.length; i++) {
          if (lastHourTweets[i] !== undefined) {
            // userArr holds usernames and id's collected
            // lastHourTweets.length holds the lenght of the array to knw when all the getUsersFromStatus() called has returned data
            // i - index
            getUsersFromStatus(
              lastHourTweets[i].screen_name,
              lastHourTweets[i].id_str,
              userArr,
              lastHourTweets.length,
              i
            );
          }
        }

        // check if all user data sets has been retrieved
        const check = setInterval(() => {
          userArr.length === lastHourTweets.length;
          if (userArr.length === lastHourTweets.length) {
            clearInterval(check);

            console.log("check complete " + userArr.length + " batches");

            setTimeout(async () => {
              // userArr.forEach(el =>{
              //   console.log(el);
              // })
              await getOnline(req, res, userArr, client);
            }, 5000);
          }
        }, 1000);
      } else {
        err = {};
        err.serverError = "Error Connecting to twitter try again";
        console.log(error);

        return res.status(500).json(err);
      }
    });
  })
);

getOnline = (req, res, userArray, client) => {
  var users = [];
  var userz = [];

  for (var i = 0; i < userArray.length; i++) {
    if (userArray[i] === undefined || userArray[i].length === 0) {
      continue;
    }
    // all the array has sub elements(users)
    // so here we compile them into one
    for (var j = 0; j < userArray[i].length; j++) {
      users.push({
        user_id: userArray[i][j].userId,
        name: userArray[i][j].name,
        screen_name: userArray[i][j].screen_name,
        photo: userArray[i][j].photo
      });
    }
  }
  // first get the unique ones from the users Array
  //  https://reactgo.com/removeduplicateobjects/

  const unique = users
    .map(e => e["user_id"])
    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
    // eliminate the dead keys & store unique objects
    .filter(e => users[e])
    .map(e => users[e]);

  // then check for the ones that are already followed

  // arrange the id's as a coma seperated list
  // for the call to twitter api
  let user_ids = "";
  for (var i = 0; i < unique.length; i++) {
    if (i === unique.length - 1 || i === 60) {
      // max 50 as we are only following 28
      user_ids += unique[i].user_id;
      break;
    } else {
      user_ids += `${unique[i].user_id},`;
    }
  }
  var params = {
    user_id: user_ids
  };
  // follow

  client.get("friendships/lookup", params, function(error, tweet, response) {
    if (!error && response.statusCode === 200) {
      // convert the returned json to array of json objects
      //  const arr =  Object.values(tweet)
      const arr = Object.keys(tweet).map(i => tweet[i]);
      var toBeFollowed = [];

      // get those accts with "connections": ["following","followed_by"]
      // i.e those m already following
      arr.map(i => {
        if (i.connections[0] === "none") {
          // get original data from our following list
          unique.map(j => {
            if (i.id_str === j.user_id) {
              toBeFollowed.push(j);
            }
          });
        }
      });

      for (var i = 0; i < toBeFollowed.length; i++) {
        userz[i] = toBeFollowed[i];
        // console.log(userz[i]);
        if (i === 39) {
          break;
        }
      }

      res.status(200).send(userz);
    } else {
      // either has an error or returned status code not equals 200
      console.log(error);
    }
  });
};

getUsersFromStatus = (
  screenNamE,
  statusId,
  userArray,
  lastHourTweetsLength,
  index
) => {
  if (screenNamE !== undefined && statusId !== undefined) {
    var users = [];
    var count = 0;

    axios.get(`https://twitter.com/${screenNamE}/status/${statusId}`).then(
      response => {
        if (response.status === 200) {
          const html = response.data;
          const $ = cheerio.load(html);
          $(".js-face-pile-container")
            .find("a")
            .map((i, el) => {
              const userId = $(el).attr("data-user-id");
              const screenName = $(el)
                .attr("href")
                .split("/")[1];
              const photo = $(el)
                .children("img")
                .attr("src");
              const name = $(el)
                .children("img")
                .attr("alt");

              // users[`${screenName}`] = {userId: userId, photo: photo};
              // data.count += 1;
              users[count] = {
                name: name,
                screen_name: screenName,
                userId: userId,
                photo: photo,
                followed: false
              };
              count++;
            });

          $(".dismissible-content").map((i, el) => {
            const userId = $(el).attr("data-user-id");
            const screenName = $(el).attr("data-screen-name");
            const photo = $(el)
              .find("img")
              .attr("src");
            const name = $(el)
              .find("img")
              .attr("alt");

            // users[`${screenName}`] = {userId: userId, photo: photo};
            // data.count += 1;
            users[count] = {
              name: name,
              screen_name: screenName,
              userId: userId,
              photo: photo,
              followed: false
            };
            count++;
          });

          // console.log(JSON.stringify(data))
          // index of the loop
          userArray[index] = users;
          // userArray[index] = data;
          // console.log("index: "+index);
        }
      },
      error => {
        console.log("ScraPING error ");
        userArray[index] = [];
      }
    );
  }
};

module.exports = router;
