const User = require("../models/User");

const passport = require("passport");
const { Strategy: TwitterStrategy } = require("passport-twitter");
const { Strategy: FacebookStrategy } = require("passport-facebook");
const { Strategy: InstagramStrategy } = require("passport-instagram");
const {
  TWITTER_CONFIG,
  FACEBOOK_CONFIG,
  INSTAGRAM_CONFIG
} = require("../config/config");

module.exports = () => {
  // Allowing passport to serialize and deserialize users into sessions
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));

  // The function that is called when an OAuth provider sends back user
  // information.  Normally, you would save the user to the database here
  // in a callback that was customized for each provider.
  const facebookCallback = (accessToken, refreshToken, profile, cb) => {
    User.findOne({
      userid: profile.id,
      provider: "facebook"
    })
      .then(user => {
        if (user) {
          const newUser = {
            userid: profile.id,
              provider: "facebook",
              usertoken: accessToken !== ""?accessToken: "",
              username: `${profile.name.givenName} ${profile.name.familyName}`,
              photo: profile.photos[0].value,
              userExist: true
          }

          cb(null, newUser);
        } else {
          const newUser = {
            userid: profile.id,
              provider: "facebook",
              usertoken: accessToken !== ""?accessToken: "",
              username: `${profile.name.givenName} ${profile.name.familyName}`,
              photo: profile.photos[0].value
          }

          cb(null, newUser);

        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const twitterCallback = (accessToken, refreshToken, profile, cb) => {
    console.log(profile)

    User.findOne({
      userid: profile.id,
      provider: "twitter"
    })
      .then(user => {
        if (user) {
          const newUser = {
            userid: profile.id,
            provider: "twitter",
            usertoken: accessToken !== ""?accessToken: "",
            username: profile.username,
            photo: profile.photos[0].value.replace(/_normal/, ""),
            userExist: true
          };

          cb(null, newUser);
        } else {
          const newUser = {
            userid: profile.id,
            provider: "twitter",
            usertoken: accessToken !== ""?accessToken: "",
            username: profile.username,
            photo: profile.photos[0].value.replace(/_normal/, "")
          };

          cb(null, newUser);

        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const instagramCallback = (accessToken, refreshToken, profile, cb) => {
    User.findOne({
      userid: profile.id,
      provider: "instagram"
    })
      .then(user => {
        if (user) {
          const newUser = {
            userid: profile.id,
            provider: "instagram",
            usertoken: accessToken !== ""?accessToken: "",
            username: profile.username,
            photo: profile._json.data.profile_picture,
            userExist: true
          };
          cb(null, newUser);
        } else {
          const newUser = {
            userid: profile.id,
            provider: "instagram",
            usertoken: accessToken !== ""?accessToken: "",
            username: profile.username,
            photo: profile._json.data.profile_picture
          };
          cb(null, newUser);

        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  updateuserToken = (user, accessToken, cb)=>{
    if(accessToken !== ""){
      User.findOneAndUpdate(
        { userid: user.userid, provider: user.provider },
        {
          $set: {
            usertoken: accessToken
          }
        },
        { new: true }
      ).then(user =>{
        cb(null, user)
      })
    }
  }

  passport.use(new TwitterStrategy(TWITTER_CONFIG, twitterCallback));
  passport.use(new FacebookStrategy(FACEBOOK_CONFIG, facebookCallback));
  passport.use(new InstagramStrategy(INSTAGRAM_CONFIG, instagramCallback));
};
