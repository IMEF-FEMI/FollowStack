const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const requireAuth = require("../../middlewares/requireAuth");
var Twitter = require("twitter");
var moment = require("moment");
var async = require("async");
const axios = require("axios");
const cheerio = require("cheerio");
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

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get(
  "/test",
  asyncHandler(async (req, res, next) => {
    res.json({msg: "twitter works"})
  })
);
router.get(
  "/check-followings/:id",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    // check if user has followings
    await Follows.findOne({ user_id: req.params.id }).then(follows => {
      if (follows) {
        res.json({
          hasFollowings: follows.following.length !== 0,
          date:
            follows.following[follows.following.length - 1] === undefined
              ? ""
              : follows.following[follows.following.length - 1].date -
                Date.now(),
          followings: follows.following
        });
      }
    });
  })
);

router.get(
  "/check-total-gained/:id",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    await User.findOne({ userid: req.params.id }).then(user => {
      if (user) {
        res.json({totalGained : user.followers_gained})
      }
    })
  })
);

router.post(
  "/get-followed-back",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[0];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.accessToken,
      access_token_secret: req.body.secret
    });

    await Follows.findOne({ user_id: req.body.userid }).then(follows => {
      if (follows.following.length !== 0) {
        var arr = follows.following;
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

            // get those accts with "connections": ["Follows", "followedby"]
            // they are the ones that followed back
            arr.map(i => {
              if (i.connections[1]) {
                // get original data from our following list
                follows.following.map(j => {
                  if (i.id_str === j.user_id) {
                    followedBack.push(j);
                  }
                });
              }
            });
            res.status(200).send(followedBack);
          } else {
            // either has an error or returned status code not equals 200
            console.log(error);
          }
        });
      } else {
        // the following list is empty
        res.status(200).send([]);
      }
    });
  })
);

router.post(
  "/gain-followers",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[0];
    console.log(random.consumerKey, random.consumerSecret);
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.accessToken,
      access_token_secret: req.body.secret
    });

    var params = { screen_name: "nodejs" };
    client.get("statuses/home_timeline", params, function(
      error,
      tweets,
      response
    ) {
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
              await followUsers(req, res, userArr, client);
            }, 5000);
          }
        }, 1000);
      } else {
        err = {};
        err.serverError = "Server Connection Error Try Again";
        return res.status(500).json(err);
      }
    });
  })
);

router.post(
  "/unfollow",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[0];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.accessToken,
      access_token_secret: req.body.secret
    });

    await Follows.findOne({ user_id: req.body.userid }).then(follows => {
      if (follows.following.length !== 0) {
        var arr = follows.following;
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

            // get those accts with "connections": ["Follows", "followedby"]
            // they are the ones that followed back
            arr.map(i => {
              if (i.connections[1]) {
                // get original data from our following list
                follows.following.map(j => {
                  if (i.id_str === j.user_id) {
                    followedBack.push(j);
                  }
                });
              }
            });
            var stats = {};
            // filter out users that dont follow back
            var toBeUnfollowed = follows.following.filter(function(o1) {
              // filter out (!) items in result2
              return !followedBack.some(function(o2) {
                return o1.user_id === o2.user_id; // assumes unique id
              });
            });

            // unfollow here
            async.each(
              toBeUnfollowed,
              function(user, callback) {
                var params = {
                  user_id: user.user_id
                };
                client.post("friendships/destroy", params, async function(
                  error,
                  tweet,
                  response
                ) {
                  if (!error && response.statusCode === 200) {
                    console.log("unfollow Successful");
                    
                  } else {
                    console.log(error);
                  }
                });
              },
              function(error, results) {
                
              }
            );

            stats.unFollowed = toBeUnfollowed;
            stats.usersFollowed = follows.following.length;
            stats.usersUnFollowed = toBeUnfollowed.length;
            stats.gained = followedBack.length;
            // empty the following array
            follows.following = []
            follows.save()
            
            // update total gained
           User.findOne({ userid: req.body.userid }).then(user => {
              if (user) {
                user.followers_gained += followedBack.length
                stats.totalGained = user.followers_gained
                user.save()
                res.json({stats : stats})
              }
            })
            

          } else {
            // either has an error or returned status code not equals 200
            console.log(error);
          }
        });
      } else {
        // the following list is empty
        res.status(200).send([]);
      }
    });
  })
);

followUsers = (req, res, userArray, client) => {
  var users = [];
  var userz = [];
  for (var i = 0; i < userArray.length; i++) {
    if (userArray[i] === undefined || userArray[i].length === 0) {
      continue;
    }
    for (var j = 0; j < userArray[i].length; j++) {
      users.push({
        user_id: userArray[i][j].userId,
        name: userArray[i][j].name,
        screen_name: userArray[i][j].screen_name,
        photo: userArray[i][j].photo
      });
    }
  }

  for (var i = 0; i < users.length; i++) {
    userz[i] = users[i];
    console.log(userz[i]);
    if (i === 30) {
      break;
    }
  }

  async.each(
    userz,
    function(user, callback) {
      var params = {
        user_id: user.user_id,
        follow: true
      };
      client.post("friendships/create", params, async function(
        error,
        tweet,
        response
      ) {
        if (!error && response.statusCode === 200) {
          await Follows.findOne({ user_id: req.body.userid }).then(follows => {
            var userObj = {
              user_id: user.user_id,
              name: user.name,
              screen_name: user.screen_name,
              photo: user.photo
            };
            follows.following.push(userObj);
            follows.save();
          });
        } else {
          console.log(error);
        }
      });
    },
    function(error, results) {
      if (error) {
        console.log(error);
      }
    }
  );
  console.log("done following");

  res.status(200).json({ followedUsers: userz });
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
                photo: photo
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
              photo: photo
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