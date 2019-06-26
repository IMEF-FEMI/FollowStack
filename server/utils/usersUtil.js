const mongoose = require("mongoose");
var Twitter = require("twitter");

const User = require("../models/User");
const { addNotification } = require("./NotificationsUtil");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

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

const follow = (info, callback, socket) => {
  const random = TWITTER_KEYS[info.key];

  var client = new Twitter({
    consumer_key: random.consumerKey,
    consumer_secret: random.consumerSecret,
    access_token_key: info.userData.accessToken,
    access_token_secret: info.userData.secret
  });
  var params = {
    user_id: info.newUser.user_id,
    follow: true
  };
  client.post("friendships/create", params, async function(
    error,
    tweet,
    response
  ) {
    if (!error && response.statusCode === 200) {
      // add new notification the the person following
      const followingNotif = {
        _id: mongoose.Types.ObjectId(socket.userInfo.user_id),
        title: "👍 Follow Successful +40 Points ",
        when: Date.now(),
        type: "pointsGained",
        to: "#"
      };
      addNotification(socket.userInfo.user_id, followingNotif);

      // add new notification the the person bieng followed
      const followedNotif = {
        _id: mongoose.Types.ObjectId(info.newUser.user_id),
        title: `${socket.userInfo.screen_name} just Followed you`,
        when: Date.now(),
        type: "followed",
        to: "#"
      };

      addNotification(info.newUser.user_id, followedNotif);

      await User.findOneAndUpdate(
        { userid: info.userData.userid },
        {
          $inc: {
            points: +40
          }
        },
        {
          new: true
        }
      ).then(user => {
        if (user) {
          callback(user.points);
        }
      });
    } else {
      console.log(error);
    }
  });
};

const unFollow = (info, callback) => {
  const random = TWITTER_KEYS[info.key];

  var client = new Twitter({
    consumer_key: random.consumerKey,
    consumer_secret: random.consumerSecret,
    access_token_key: info.userData.accessToken,
    access_token_secret: info.userData.secret
  });
  var params = {
    user_id: info.newUser.user_id
  };
  client.post("friendships/destroy", params, async function(
    error,
    tweet,
    response
  ) {
    if (!error && response.statusCode === 200) {
      // add notification
      const unfollowNotif = {
        _id: mongoose.Types.ObjectId(socket.userInfo.user_id),
        title: "👍 user unFollowed - 40 Points ",
        when: Date.now(),
        type: "pointsDeducted",
        to: "#"
      };
      addNotification(socket.userInfo.user_id, unfollowNotif);

      await User.findOneAndUpdate(
        { userid: info.userData.userid },
        {
          $inc: {
            points: -40
          }
        },
        {
          new: true
        }
      ).then(user => {
        if (user) {
          callback(user.points);
        }
      });
    } else {
      console.log(error);
    }
  });
};

const lookup = (info, users, callback) => {
  const random = TWITTER_KEYS[info.key];

  var client = new Twitter({
    consumer_key: random.consumerKey,
    consumer_secret: random.consumerSecret,
    access_token_key: info.userData.accessToken,
    access_token_secret: info.userData.secret
  });
  let user_ids = "";
  for (var i = 0; i < users.length; i++) {
    if (i === users.length - 1) {
      user_ids += users[i].user_id;
    } else {
      user_ids += `${users[i].user_id},`;
    }
  }
  var params = {
    user_id: user_ids
  };
  client.get("friendships/lookup", params, function(error, tweet, response) {
    if (!error && response.statusCode === 200) {
      // convert the returned json to array of json objects
      //  const users =  Object.values(tweet)
      const arr = Object.keys(tweet).map(i => tweet[i]);

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
      client = null;
      callback(users);
    } else {
      // either has an error or returned status code not equals 200
      console.log(error);
    }
  });
};

module.exports = { follow, unFollow, lookup };
