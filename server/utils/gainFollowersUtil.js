const User = require("../models/User");
const mongoose = require("mongoose");


mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);


const flagTokensAsExpired = (user) => {
    User.findOneAndUpdate(
        { userid: user.user_id },
        { $set: { token_expired: true } }
      ).catch(err => console.log(err));
};



const friendshipLookup = (userData, key, users, callback) => {
  var random = TWITTER_KEYS[key];

  var client = new Twitter({
    consumer_key: random.consumerKey,
    consumer_secret: random.consumerSecret,
    access_token_key: userData.accessToken,
    access_token_secret: userData.secret
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
  flagTokensAsExpired,
  friendshipLookup
};
