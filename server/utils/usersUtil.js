const mongoose = require("mongoose");
var Twitter = require("twitter");

const User = require("../models/User");
const UsersOnline = require("../models/UsersOnline");


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
  var random = null
  if (socket.userInfo === undefined) {
 return socket.emit("get-user-info", {}, userInfo => {
    userInfo.socketId = socket.id;
    socket.userInfo = userInfo;
    users.unshift(userInfo);
    random = TWITTER_KEYS[socket.userInfo.keyInUse];

    // users = seed;
    console.log(userInfo);
    console.log("current users length " + users.length);
  });

  }else{
    random = TWITTER_KEYS[socket.userInfo.keyInUse];
  }


  var client = new Twitter({
    consumer_key: random.consumerKey,
    consumer_secret: random.consumerSecret,
    access_token_key: socket.userInfo.accessToken,
    access_token_secret: socket.userInfo.secret
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
      

      await User.findOneAndUpdate(
        { userid: socket.userInfo.user_id },
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
          
          // callback notification on client side
          callback({points: user.points});
        }
      });
    } else {
      console.log(error);
    }
  });
};

const followUs = (req, res) => {
  const random = TWITTER_KEYS[req.params.key];
    const userData = req.body.userData
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: userData.accessToken, 
      access_token_secret: userData.secret
    });

 var params = {
    user_id: '1093431513071394817'
  };
  client.get("friendships/lookup", params, function(error, friendship, response) {
    if (!error && response.statusCode === 200) {
      if (friendship[0].connections[0] === 'following' || friendship[0].connections[1] === 'following') {
        res.status(200).send({following: 'you are already following us'})
      }else{
         var params = {
            user_id: '1093431513071394817',
            follow: true
          };

        client.post("friendships/create", params, async function(
          error,
          tweet,
          response
        ) {
          if (!error && response.statusCode === 200) {
            await User.findOneAndUpdate(
              { _id: mongoose.Types.ObjectId(req.user._id) },
              {
                $inc: {
                  points: +50
                }
              },
              {
                new: true
              }
            ).then(user => {
              if (user) {
                
                // callback notification on client side
            res.status(200).send({success: 'you are now following us', points: user.points})
              }
            });
          } else {
            console.log(error[0].message);
            res.status(200).send({error: error[0].message})
          }
        });
      }
      
    } else {
      // either has an error or returned status code not equals 200
      console.log(error);
      if (error[0]) {
      res.status(200).send({error: error[0].message})
      }else{
      res.status(500).send({error: error})
      }
    }
  });


 
};
const followBack = (info, socket, callback) => {
  // the person u followed automatically following back
  const random = TWITTER_KEYS[info.newUser.keyInUse];

  var client = new Twitter({
    consumer_key: random.consumerKey,
    consumer_secret: random.consumerSecret,
    access_token_key: info.newUser.accessToken,
    access_token_secret: info.newUser.secret
  });
  var params = {
    user_id: socket.userInfo.user_id,
    follow: true
  };
  client.post("friendships/create", params, function(
    error,
    tweet,
    response
  ) {
    if (!error && response.statusCode === 200) {
      callback() 
    } else {
      console.log(error);
    }
  });
};

const unFollow = (info, callback, socket) => {
  var random = null
  if (socket.userInfo === undefined) {
 return socket.emit("get-user-info", {}, userInfo => {
    userInfo.socketId = socket.id;
    socket.userInfo = userInfo;
    users.unshift(userInfo);
    random = TWITTER_KEYS[socket.userInfo.keyInUse]
    // users = seed;
    console.log(userInfo);
    console.log("current users length " + users.length);
  });

  }else{
    random = TWITTER_KEYS[socket.userInfo.keyInUse];
  }

  var client = new Twitter({
    consumer_key: random.consumerKey,
    consumer_secret: random.consumerSecret,
    access_token_key: socket.userInfo.accessToken,
    access_token_secret: socket.userInfo.secret
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
      
      callback();

    } else {
      console.log(error);
    }
  });
};

const getOnlineUsers = (socket, info, users, callback) => {
  friendshipLookup(socket, info, users, arr => {
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
    callback({users: users});
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

const friendshipLookup = (socket, info, users, callback ) => {
  
  var random = null
  if (socket.userInfo === undefined) {
 return socket.emit("get-user-info", {}, userInfo => {
    userInfo.socketId = socket.id;
    socket.userInfo = userInfo;
    users.unshift(userInfo);
    random = TWITTER_KEYS[socket.userInfo.keyInUse];
    
    // users = seed;
    console.log(userInfo);
    console.log("current users length " + users.length);
  });

  }else{
    random = TWITTER_KEYS[socket.userInfo.keyInUse];
  }

  var client = new Twitter({
    consumer_key: random.consumerKey,
    consumer_secret: random.consumerSecret,
    access_token_key: socket.userInfo.accessToken,
    access_token_secret: socket.userInfo.secret
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
  followUs,
  unFollow,
  followBack,
  getOnlineUsers,
  // getFollowedBack,
  // getNotFollowingBack,
  // clearFollowings
};
