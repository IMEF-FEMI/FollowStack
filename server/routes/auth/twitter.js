const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const oauth = require("oauth");
const inspect = require("util-inspect");

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

router.get(
  "/twitter/connect/:key",
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    console.log(req.protocol+ '://'+ req.get('host') + req.originalUrl)
    const authorizeUrl =
      parseInt(req.params.key) === 4
        ? "http://127.0.0.1:3000/auth/authorize"
        : "http://www.followstack.com/auth/authorize";
    console.log("twitter connect");
    var consumer = new oauth.OAuth(
      "https://twitter.com/oauth/request_token",
      "https://twitter.com/oauth/access_token",
      random.consumerKey,
      random.consumerSecret, 
      "1.0A",
      authorizeUrl, 
      "HMAC-SHA1"
    );

    consumer.getOAuthRequestToken(function(
      error,
      oauthToken,
      oauthTokenSecret,
      results
    ) {
      if (error) {
        res
          .status(500)
          .send({
            error: "Error getting OAuth request token : " + inspect(error)
          });
      } else {
        console.log("Double check on 2nd step");
        console.log("------------------------");
        console.log("<<oauthRequestToken " + oauthToken);
        console.log("<<oauthRequestTokenSecret " + oauthTokenSecret);
        consumer = null;
        res
          .status(200)
          .send({
            redirectUrl:
              "https://twitter.com/oauth/authorize?oauth_token=" + oauthToken,
            oauthRequestToken: oauthToken,
            oauthRequestTokenSecret: oauthTokenSecret
          });
      }
    });
  })
);

router.get(
  "/callback/twitter/:key/:oauthRequestToken/:oauthRequestTokenSecret/:oauth_verifier",
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    const authorizeUrl =
      req.params.key === 4
        ? "http://127.0.0.1:3000/auth/authorize"
        : "http://www.followstack.com/auth/authorize";
    var consumer = new oauth.OAuth(
      "https://twitter.com/oauth/request_token",
      "https://twitter.com/oauth/access_token",
      random.consumerKey,
      random.consumerSecret,
      "1.0A",
      authorizeUrl,
      "HMAC-SHA1"
    );

    console.log("------------------------");
    console.log(">>oauthRequestToken " + req.params.oauthRequestToken);
    console.log(
      ">>oauthRequestTokenSecret " + req.params.oauthRequestTokenSecret
    );
    console.log(">>oauth_verifier " + req.params.oauth_verifier);

    consumer.getOAuthAccessToken(
      req.params.oauthRequestToken,
      req.params.oauthRequestTokenSecret,
      req.params.oauth_verifier,
      function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
        if (error) {
          res
            .status(500)
            .send({
              error:
                "Error getting OAuth access token : " +
                inspect(error) +
                "[" +
                oauthAccessToken +
                "]" +
                "[" +
                oauthAccessTokenSecret +
                "]" +
                "[" +
                inspect(results) +
                "]"
            });
        } else {
          consumer = null;
          res
            .status(200)
            .send({
              oauthAccessToken: oauthAccessToken,
              oauthAccessTokenSecret: oauthAccessTokenSecret
            });
        }
      }
    );
  })
);

router.get(
  "/verify/twitter/:key/:oauthAccessToken/:oauthAccessTokenSecret",
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    const authorizeUrl =
      req.params.key === 4
        ? "http://127.0.0.1:3000/auth/authorize"
        : "http://www.followstack.com/auth/authorize";
    var consumer = new oauth.OAuth(
      "https://twitter.com/oauth/request_token",
      "https://twitter.com/oauth/access_token",
      random.consumerKey,
      random.consumerSecret,
      "1.0A",
      authorizeUrl,
      "HMAC-SHA1"
    );

    consumer.get(
      "https://api.twitter.com/1.1/account/verify_credentials.json",
      req.params.oauthAccessToken,
      req.params.oauthAccessTokenSecret,
      function(error, data, response) {
        if (error) {
          console.log(error);
          consumer = null;
          res.status(500).send({ error: "authentication error" });
        } else {
          var parsedData = JSON.parse(data);
          consumer = null;
          res.status(200).send({ user: parsedData });
        }
      }
    );
  })
);
module.exports = router;
