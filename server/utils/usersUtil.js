const mongoose = require("mongoose");
var Twitter = require("twitter");

const User = require("../models/User");

var url = require("url");
const fs = require("fs");
const path = require("path");


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
  },
  {
    consumerKey: process.env.TWITTER_APP_DEV_KEY,
    consumerSecret: process.env.TWITTER_APP_DEV_SECRET
  }
];

const follow = (info, callback, socket) => {
  
  getKeyFromSocket(socket, random=>{
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: socket.userInfo.accessToken,
      access_token_secret: socket.userInfo.secret
    });
    var params = {
      user_id: info.newUser.userid
    };
    client.post("friendships/create", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        callback({ success: true });
      } else {
        console.log(error);
      }
    });
  })
 
};

const followUs = (req, res) => {
  const random = TWITTER_KEYS[req.params.key];
  const userData = req.body.userData;
  var client = new Twitter({
    consumer_key: random.consumerKey,
    consumer_secret: random.consumerSecret,
    access_token_key: userData.accessToken,
    access_token_secret: userData.secret
  });

  var params = {
    user_id: "1093431513071394817"
  };
  client.get("friendships/lookup", params, function(
    error,
    friendship,
    response
  ) {
    if (!error && response.statusCode === 200) {
      if (
        friendship[0].connections[0] === "following" ||
        friendship[0].connections[1] === "following"
      ) {
        res.status(200).send({ following: "you are already following us" });
      } else {
        var params = {
          user_id: "1093431513071394817",
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
                res.status(200).send({
                  success: "you are now following us",
                  points: user.points
                });
              }
            });
          } else {
            console.log(error[0].message);
            res.status(200).send({ error: error[0].message });
          }
        });
      }
    } else {
      // either has an error or returned status code not equals 200
      console.log(error);
      if (error[0]) {
        res.status(200).send({ error: error[0].message });
      } else {
        res.status(500).send({ error: error });
      }
    }
  });
};
const followBack = (info, socket, callback) => {
  // the person u followed automatically following back

  getKeyFromSocket(socket, random=>{
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: info.newUser.accessToken,
      access_token_secret: info.newUser.secret
    });
    var params = {
      user_id: socket.userInfo.user_id,
    };
    client.post("friendships/create", params, function(error, tweet, response) {
      if (!error && response.statusCode === 200) {
        callback();
      } else {
        console.log(error);
      }
    });
  })
 
};

const unFollow = (info, callback, socket) => {
 getKeyFromSocket(socket, random=>{
   
  var client = new Twitter({
    consumer_key: random.consumerKey,
    consumer_secret: random.consumerSecret,
    access_token_key: socket.userInfo.accessToken,
    access_token_secret: socket.userInfo.secret
  });
  var params = {
    user_id: info.newUser.userid
  };
  client.post("friendships/destroy", params, async function(
    error,
    tweet,
    response
  ) {
    if (!error && response.statusCode === 200) {
      client = null
      callback();
    } else {
      console.log(error);
    }
  });
 })

};

const unFollowBack = (socket, callback, info) => {

  const random = TWITTER_KEYS[parseInt(info.newUser.keyInUse)]

  getSocketFromSocket(socket, userInfo=>{
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: info.newUser.accessToken,
      access_token_secret: info.newUser.secret
    });
  
    var params = {
      user_id: socket.userInfo.user_id
    };
    client.post("friendships/destroy", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        client = null
        callback();
      } else {
        console.log(error);
      }
    });
  })
  








// const random = TWITTER_KEYS[parseInt(info.newUser.keyInUse)]
//   var client = new Twitter({
//       consumer_key: random.consumerKey,
//       consumer_secret: random.consumerSecret,
//       access_token_key: info.newUser.accessToken,
//       access_token_secret: info.newUser.secret
//     });
//     var params = {
//       user_id: socket.userInfo.userid
//     };
   
//     client.post("friendships/destroy", params, async function(
//       error,
//       tweet,
//       response
//     ) {
//       if (!error && response.statusCode === 200) {
//         callback();
//       } else {
//         console.log(error);
//       }
//     });
  
};

const getOnlineUsers = async (socket, callback) => {

    // get 15 active(token_expired = false) users at random and get friendship status
    const users = await User.aggregate([
      { $match: { token_expired: false } },
      { $sample: {size: 15} },
    ]).exec();
  friendshipLookup(socket, users, arr => {
    // identify those already followed
    
    arr.map(i => {
      users.map(j => {
        if (i.id_str === j.userid) {
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
    callback({ users: users });
  });
};

const friendshipLookup = async (socket, users, callback) => {

  getKeyFromSocket(socket, random=>{

    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: socket.userInfo.accessToken,
      access_token_secret: socket.userInfo.secret
    });
    let user_ids = "";
    for (var i = 0; i < users.length; i++) {
      if (i === users.length - 1) {
        user_ids += users[i].userid;
      } else {
        user_ids += `${users[i].userid},`;
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
  })
 
};

const limitReachedPost = user => {
  const random = TWITTER_KEYS[user.keyInUse];
  const userData = user;
  var client = new Twitter({
    consumer_key: random.consumerKey,
    consumer_secret: random.consumerSecret,
    access_token_key: userData.accessToken,
    access_token_secret: userData.secret
  });

  var params = {
    media: fs.readFileSync(
      path.resolve(__dirname, "../assets/img/hashtag.png")
    )
  };
  var mediaId = "";
  // first upload image
  client.post("media/upload", params, async function(error, media, response) {
    if (!error && response.statusCode === 200) {
      mediaId = media.media_id_string;
      // then update status
      var status = {
        status: `I Just Gained 25 new followers on #FollowStack  https://followstack.herokuapp.com  ` ,
        media_ids: mediaId // Pass the media id string
      };

      client.post("statuses/update", status, async function(
        error,
        tweet,
        response
      ) {
        if (!error) {
          console.log("limit reach post")
        } else {
          console.log(error[0].message);
        }
      });
    }
  });
};

const updateUserKeys = (userInfo) => {
  User.findOneAndUpdate(
    { userid: userInfo.user_id },
    {
      screen_name: userInfo.screen_name,
      photo: userInfo.photo,
      token_expired: false,
      socketId: userInfo.socketId,
      accessToken: userInfo.accessToken,
      secret: userInfo.secret,
      keyInUse: userInfo.keyInUse
    }
  ).catch(err => console.log(err));
}
const getKeyFromSocket =  (socket, callback) =>{
  var random = null;

  if (socket.userInfo === undefined) {
     socket.emit("get-user-info", {}, userInfo => {
      userInfo.socketId = socket.id;
      socket.userInfo = userInfo;
      updateUserKeys(userInfo)
      random = TWITTER_KEYS[socket.userInfo.keyInUse];
      callback(random)
      // users = seed;
      // console.log(userInfo);
    });
  } else {
    random = TWITTER_KEYS[socket.userInfo.keyInUse];
  }
  if(random !== null){
    callback(random)
  }
}

const getSocketFromSocket =  (socket, callback) =>{
     socket.emit("get-user-info", {}, userInfo => {
      userInfo.socketId = socket.id;
      socket.userInfo = userInfo;
      callback(userInfo)
    });
}
module.exports = {
  follow,
  followBack,
  followUs,
  unFollow,
  unFollowBack,
  getOnlineUsers,
  limitReachedPost,
  updateUserKeys,
  getKeyFromSocket,
  getSocketFromSocket
};
