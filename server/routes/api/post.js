const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const requireAuth = require("../../middlewares/requireAuth");
const {followUs} = require("../../utils/usersUtil");
var Twitter = require("twitter");
var async = require("async");
var url = require('url');

// multer upload imports
const path = require("path");
const multer = require("multer");
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)


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
const Post = require("../../models/Post");
const User = require("../../models/User");


mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);


// @route   GET api/Post/test
// @desc    Tests Post route
// @access  Public
router.get(
  "/test",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    res.json({ msg: req.user });
  })
);



const storage = multer.diskStorage({   
  destination: "./public/uploads/",
   filename: function(req, file, cb){
      cb(
        null,"IMAGE-" + Date.now() + path.extname(file.originalname));
   }
});
const upload = multer({storage: storage}).any()

router.post(
  "/new-tweet/:key",
  requireAuth,
  upload,
  asyncHandler(async (req, res, next) => {
 const random = TWITTER_KEYS[req.params.key];
    const userData = JSON.parse(req.body.userData)
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: userData.accessToken, 
      access_token_secret: userData.secret
    });
   
     // rremove points
     // add post to db and return tweet obj
      await User.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.user._id),
        points: { $gte: 100 }
      }, 
      {
        $inc: {
          points: -100
        }
      },
      {
        new: true
      }
    )
      .then(async user => {
        if (user) {
// update status (twitter)
    var mediaIds = []
      if (req.files) { 
           async.each(req.files, function(file, callback) {
            var params = {
                media: fs.readFileSync(file.path) 
              };

              client.post('media/upload', params, async function(error, media, response) {
                if (!error && response.statusCode === 200) {
                  mediaIds.push(media.media_id_string)                
                 callback()
                  } else {
                    return callback(error)
                  }
                });
                },function(error) {
                if(error){
                    console.log("error ", error)
                }else{
                console.log("finished uploads");
                var media_ids = ""
                mediaIds.map(ids=>{
                  media_ids+= `${ids},`
                })


               // Delete the file like normal
              req.files.map(async (file)=>{
                await unlinkAsync(file.path)
              })
                    // Lets tweet it
                  var status = {
                    status: JSON.parse(req.body.tweet_text) + "#followStackApp",
                    media_ids: media_ids // Pass the media id string

                  }

                client.post('statuses/update', status, async function(error, tweet, response) {
              if (!error) {
                console.log("status updated");
          const post = await new Post({
            _owner: mongoose.Types.ObjectId(req.user._id),
            text: tweet.text,
            post_id: tweet.id_str,
            name: tweet.user.name,
            screen_name: tweet.user.screen_name,
            photo: tweet.user.profile_image_url_https
          });
          post.save(function(err) {
            if (err) {
              console.log(err);
              res.status(200).send({
                error: "Could Not share tweet. Try again"
              });
            } else {
              // tweet added successfully send back to client
              res.status(200).send({
                success: "Status Updated! ",
                points: user.points,
                tweet: tweet
              });
            }
          });
              }else{
                console.log(error)
              }
            });
          }
        }
      );
   }else{
      var status = {
      status: JSON.parse(req.body.tweet_text) + "#followStackApp",
      }

       client.post('statuses/update', status, async function(error, tweet, response) {
              if (!error) {
                console.log("status updated");
          const post = await new Post({
            _owner: mongoose.Types.ObjectId(req.user._id),
            text: tweet.text,
            post_id: tweet.id_str,
            name: tweet.user.name,
            screen_name: tweet.user.screen_name,
            photo: tweet.user.profile_image_url_https
          });
          post.save(function(err) {
            if (err) {
              console.log(err);
              res.status(200).send({
                error: "Could Not share tweet. Try again"
              });
            } else {

               // Delete the file like normal
              req.files.map(async (file)=>{
                await unlinkAsync(file.path)
              })
               // tweet added successfully send back to client
              res.status(200).send({
                success: "Status Updated ",
                points: user.points,
                tweet: tweet
              });
            }
          });
              }else{
                console.log(error)

               // Delete the file like normal
              req.files.map(async (file)=>{
                await unlinkAsync(file.path)
              })

                res.status(500).send({
                error: error
              });
              }
            });
   }


   // Delete the file like normal
  req.files.map(async (file)=>{
    await unlinkAsync(file.path)
  })


        } else {
          // user did not meet search criteria i.e not enough points
          res.status(200).send({
            error: "Not enough Points! Go blow up some tweets"
          });
        }
      })
      .catch(e => {
        console.log(e); //user.findOneAndUpdate error
        res.status(200).send({
          error: "An error Occured try again"
          // postData: post
        });
      });


  }))


router.post(
  "/share-link/:key",
  requireAuth,
  upload,
  asyncHandler(async (req, res, next) => {
 const random = TWITTER_KEYS[req.params.key];
    const userData = req.body.userData
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: userData.accessToken, 
      access_token_secret: userData.secret
    });


    var params = {
        media: fs.readFileSync(path.resolve(__dirname, '../../assets/img/hashtag.png')) 
      };
      var mediaId = ''
      // first upload image
      client.post('media/upload', params, async function(error, media, response) {
        if (!error && response.statusCode === 200) {
          mediaId = media.media_id_string     
          // then update status
         var status = {
              status: `Get more Followers, likes, comments and Retweets on Follow-Stack.com The Number 1 twitter #followforfollow Platform  #followStackApp ${url.format({protocol: req.protocol,host: req.get('host')})}`,
              media_ids: mediaId // Pass the media id string
            }

      client.post('statuses/update', status, async function(error, tweet, response) {
         if (!error) {
           await User.findOneAndUpdate(
                {
                  _id: mongoose.Types.ObjectId(req.user._id),
                }, 
                {
                  $inc: {
                    points: +50
                  }
                },
                {
                  new: true
                }
              )
            .then(async user => {
              if (user) {
                res.status(200).send({success: "Status Updated", points: user.points})

              }}).catch(err=>{
                res.status(500).send({error: err})
              })


              }})
          } 
        });

  }))


router.post(
  "/follow-us/:key",
  requireAuth,
  asyncHandler(async (req, res, next) => {
 followUs(req, res)

}))

router.post(
  "/add-tweet",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    // need userData for the tokens
    // tweet object for the tweet info
    // key for the corrrensponding api key
    // user_id for the post object
    // console.log("addTweet  called == user ", req.body.tweet.user);
    await User.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.body.user_id),
        points: { $gte: 100 }
      }, 
      {
        $inc: {
          points: -100
        }
      },
      {
        new: true
      }
    )
      .then(async user => {
        if (user) {
          const { tweet } = req.body;
          const post = await new Post({
            _owner: mongoose.Types.ObjectId(req.body.user_id),
            text: tweet.text,
            post_id: tweet.id_str,
            name: tweet.user.name,
            screen_name: tweet.user.screen_name,
            photo: tweet.user.profile_image_url_https
          });
          post.save(function(err) {
            if (err) {
              console.log(err);
              res.status(200).send({
                error: "Could Not share tweet. Try again"
              });
            } else {
              res.status(200).send({
                success: "Tweet Shared Successfully! ",
                points: user.points
              });
            }
          });
        } else {
          // user did not meet search criteria i.e not enough points
          res.status(200).send({
            error: "Not enough Points! Go blow up some tweets"
          });
        }
      })
      .catch(e => {
        console.log(e); //user.findOneAndUpdate error
        res.status(200).send({
          error: "An error Occured try again"
          // postData: post
        });
      });
  })
);

router.delete(
  "/remove-tweet/:post_id/:user_id",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    try {
      await Post.findOneAndDelete({
        _owner: mongoose.Types.ObjectId(req.params.user_id),
        post_id: req.params.post_id
      })
        .then(post => {

          res.json({ success: "Tweet removed" });
        })
        .catch(e => {
          console.log(e);
          res.json({ error: "try again" });
        });
    } catch (e) {
      console.log(e);

      res.status(200).send({
        error: "Could not remove post. try again"
      });
    }
  })
);

// add comment
router.post(
  `/post-comment/:key`,
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.userData.accessToken,
      access_token_secret: req.body.userData.secret
    });

    // console.log("comment ", req.body.comment)
    const { tweet: data } = req.body;
    var params = {
      status: `@${data.user.screen_name} ${req.body.comment} #followStackApp`,
      in_reply_to_status_id: data.id_str
    };
    client.post("statuses/update", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        await User.findOneAndUpdate(
          { userid: req.body.userData.userid },
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

            res.status(200).send({
              success: "👍 +20 Points Earned ",
              points: user.points
            });
          }
        });
      } else {
        // comment reply error
        console.log(error);
      }
    });
  })
);

router.post(
  `/post-like/:key`,
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.userData.accessToken,
      access_token_secret: req.body.userData.secret
    });

    const { tweet: data } = req.body;
    var params = {
      id: data.id_str
    };
    client.post("favorites/create", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        await User.findOneAndUpdate(
          { userid: req.body.userData.userid },
          {
            $inc: {
              points: +10
            }
          },
          {
            new: true
          }
        ).then(user => {
          if (user) {

            res.status(200).send({
              success: "👍 +10 Points Earned ",
              points: user.points
            });
          }
        });
      } else {
        // comment reply error
        console.log(error);
      }
    });
  })
);

router.post(
  `/unpost-like/:key`,
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.userData.accessToken,
      access_token_secret: req.body.userData.secret
    });

    // console.log("comment ", req.body.comment)
    const { tweet: data } = req.body;
    var params = {
      id: data.id_str
    };
    client.post("favorites/destroy", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        await User.findOneAndUpdate(
          { userid: req.body.userData.userid },
          {
            $inc: {
              points: -10
            }
          },
          {
            new: true
          }
        ).then(user => {
          if (user) {

            res.status(200).send({
              success: "👎 10 Points Deducted",
              points: user.points
            });
          }
        });
      } else {
        // comment reply error
        console.log(error);
      }
    });
  })
);

router.post(
  `/post-retweet/:key`,
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.userData.accessToken,
      access_token_secret: req.body.userData.secret
    });

    // console.log("comment ", req.body.comment)
    const { tweet: data } = req.body;
    var params = {
      id: data.id_str
    };
    client.post("statuses/retweet", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        await User.findOneAndUpdate(
          { userid: req.body.userData.userid },
          {
            $inc: {
              points: +30
            }
          },
          {
            new: true
          }
        ).then(user => {
          if (user) {

            res.status(200).send({
              success: "👍 +30 Points Earned",
              points: user.points
            });
          }
        });
      } else {
        // comment reply error
        console.log(error);
      }
    });
  })
);

router.post(
  `/unpost-retweet/:key`,
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.userData.accessToken,
      access_token_secret: req.body.userData.secret
    });

    // console.log("comment ", req.body.comment)
    const { tweet: data } = req.body;
    var params = {
      id: data.id_str
    };
    client.post("statuses/unretweet", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        await User.findOneAndUpdate(
          { userid: req.body.userData.userid },
          {
            $inc: {
              points: -30
            }
          },
          {
            new: true
          }
        ).then(user => {
          if (user) {

            res.status(200).send({
              success: "👎 30 Points Deducted",
              points: user.points
            });
          }
        });
      } else {
        // comment reply error
        console.log(error);
      }
    });
  })
);

router.post(
  "/get-profile-tweets/:key/:page",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.accessToken,
      access_token_secret: req.body.secret
    });

    // here i added the user_id to the userData obj
    const posts = await Post.find({
      _owner: mongoose.Types.ObjectId(req.body.user_id)
    });
    const page = req.params.page === 0 ? 1 : parseInt(req.params.page) + 1;
    var params = {
      user_id: req.body.userid,
      count: 20 * page
    };
    
    console.log("tweets to retrieve ", params.count);
    client.get("statuses/user_timeline", params, async function(
      error,
      tweet,
      response
    ) {
      if (!error && response.statusCode === 200) {
        const allTweet = Object.keys(tweet).map(i => tweet[i]);
        const tweetForPage = allTweet.slice(req.body.recievedTweets, 20 * page);
        console.log("Tweets retrieved ", allTweet.length);

        if (
          parseInt(page) > 1 &&
          tweetForPage.length !== 0 &&
          req.body.recievedTweets !== 0
        ) {
          if (posts.length !== 0) {
            posts.map(post => {
              tweetForPage.map(tweet => {
                if (post.post_id === tweet.id_str) {
                  // chcking for tweets that user has already added to db
                  tweet.added = true;
                }
              });
            });
            return res.send({tweets: tweetForPage, shared: posts.length});
          }
          return res.send({tweets: tweetForPage, shared: posts.length});
        } else if (parseInt(page) === 1) {
          if (posts.length !== 0) {
            posts.map(post => {
              allTweet.map(tweet => {
                if (post.post_id === tweet.id_str) {
                  tweet.added = true;
                }
              });
            });
            return res.send({tweets: allTweet, shared: posts.length});
          }
            return res.send({tweets: allTweet, shared: posts.length});
        } else if (tweetForPage.length === 0) {
          res.send();
        } 
      } else {
        console.log(error);
      }
    });
  })
);

router.post(
  "/get-main-tweets/:key/:page",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.accessToken,
      access_token_secret: req.body.secret
    });

    try {
      const { page } = req.params;

      var posts = await Post.find({})
        .sort({ createdAt: -1 })
        .limit(12)
        .skip(12 * page)
        
        .exec();
      let post_ids = "";

      for (var i = 0; i < posts.length; i++) {
        if (i === posts.length - 1) {
          post_ids += posts[i].post_id;
        } else {
          post_ids += `${posts[i].post_id},`;
        }
      }
      var params = {
        id: post_ids
      };
      
      client.get("statuses/lookup", params, async function(
        error,
        tweet,
        response
      ) {
        if (!error && response.statusCode === 200) {
         
          // return in createdAt order
           for(var i = 0; i<posts.length; i++){
            for(var j = 0; j<tweet.length; j++){
              if(posts[i].post_id === tweet[j].id_str){
                posts[i] = tweet[j] 
              }
            }
          }
          res.send(posts);
        } else {
          console.log(error);
        }
      });
    } catch (e) {
      console.log(e);
    }
  })
);
module.exports = router;
