const providers = ["twitter", "facebook", "instagram"];

const callbacks = providers.map(provider => {
  return process.env.NODE_ENV === "production"
    ? `https://react-auth-twitter.herokuapp.com/${provider}/callback`
    : `https://localhost:8080/${provider}/callback`;
});

const [twitterURL, facebookURL, instagramURL] = callbacks;

exports.TWITTER_CONFIG = {
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: twitterURL
};

exports.FACEBOOK_CONFIG = {
  clientID: process.env.FACEBOOK_KEY,
  clientSecret: process.env.FACEBOOK_SECRET,
  profileFields: ["id", "emails", "name", "picture.width(250)"],
  callbackURL: facebookURL
};
exports.INSTAGRAM_CONFIG = {
  clientID: process.env.INSTAGRAM_KEY,
  clientSecret: process.env.INSTAGRAM_SECRET,
  callbackURL: instagramURL
};
