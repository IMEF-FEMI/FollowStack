const mongoose = require("mongoose");
var Twitter = require("twitter");

const User = require("../models/User");
const UsersOnline = require("../models/UsersOnline");
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
        title: "👍 Follow Successful +40 Points ",
        notificationType: "pointsGained"
      };
      addNotification(socket.userInfo.user_id, followingNotif);

      // add new notification the the person bieng followed
      const followedNotif = {
        title: `${socket.userInfo.screen_name} just Followed you`,
        notificationType: "followed"
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
          
          // callback notification on client side
          callback(user.points);
        }
      });
    } else {
      console.log(error);
    }
  });
};

const unFollow = (info, callback, socket) => {
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
        title: "👍 user unFollowed",
        type: "error"
      };
      addNotification(socket.userInfo.user_id, unfollowNotif);
      callback(user.points);

    } else {
      console.log(error);
    }
  });
};

const getOnlineUsers = (info, users, callback) => {
  friendshipLookup(info, users, arr => {
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
    callback(users);
  });
};

// const getFollowedBack = async (info, callback) => {
//   await UsersOnline.findOne({ user_id: info.userData.userid }).then(user => {
//     if (user.following.length !== 0) {
//       var users = user.following.slice(info.currentUsers, 10 * (info.page + 1));
//       friendshipLookup(info, users, arr => {
//         // identify those following back
//         var followingBack = [];
//         arr.map(i => {
//           users.map(j => {
//             if (i.id_str === j.user_id) {
//               if (
//                 i.connections[0] === "followed_by" ||
//                 i.connections[1] === "followed_by"
//               ) {
//                 followingBack.push(j);
//               }
//             }
//           });
//         });
//         callback(followingBack);
//       });
//     }
//   });
// };

// const getNotFollowingBack = async (info, callback) => {
//   await UsersOnline.findOne({ user_id: info.userData.userid }).then(user => {
//     if (user.following.length !== 0) {
//       var users = user.following.slice(info.currentUsers, 10 * (info.page + 1));
//       friendshipLookup(info, users, arr => {
//         // identify those following back
//         var notFollowingBack = [];
//         arr.map(i => {
//           users.map(j => {
//             if (i.id_str === j.user_id) {
//               if (i.connections[1] !== "followed_by") {
//                 notFollowingBack.push(j);
//               }
//             }
//           });
//         });
//         callback(notFollowingBack);
//       });
//     }
//   });
// };

// const clearFollowings = async (info, callback) => {
//   await UsersOnline.findOneAndUpdate(
//     { user_id: info.userData.userid },
//     { $set: { following: [] } }
//   ).then(userOnline => {
//     console.log("followings cleared successfully");
//     callback();
//   });
// };

const friendshipLookup = (info, users, callback) => {
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

      client = null;
      callback(arr);
    } else {
      // either has an error or returned status code not equals 200
      console.log(error);
    }
  });
};

module.exports = {
  follow,
  unFollow,
  getOnlineUsers,
  // getFollowedBack,
  // getNotFollowingBack,
  // clearFollowings
};
