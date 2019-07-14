const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const keys = require("../../../config/keys");
const requireAuth = require("../../middlewares/requireAuth");


// Load User  model
const User = require("../../models/User");
const Post = require("../../models/Post");
const Transaction = require("../../models/Transactions");
const Notifications = require("../../models/Notifications");
const {addNotification} = require("../../utils/NotificationsUtil")
const {addTransaction} = require("../../utils/TransactionsUtil")

 
// 1a. Import the SDK package
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

// 1b. Import the PayPal SDK client that was created in `Set up Server-Side SDK`.
/**
 *
 * PayPal HTTP client dependency
 */
const payPalClient = require('../../common/payPalClient');

var Twitter = require("twitter");
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

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

//register end-point
router.post(
  "/register",
  asyncHandler(async (req, res, next) => {
    // expiration time
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    var error = {};
    await User.findOne({
      userid: req.body.userid,
      username: req.body.username
    }).then(user => {
      if (user) {
        error.userError = "User already exist";
        return res.status(400).json(error);
      } else {
        const newUser = new User({
          username: req.body.username,
          userid: req.body.userid,
          location: req.body.location
        });

        newUser
          .save()
          .then(user => {
            Promise.all([
              // new UsersOnline({
              //   username: req.body.username,
              //   user_id: req.body.userid
              // }).save(),
              new Notifications({
                user_id: req.body.userid
              }).save(),
              new Transaction({
                user_id: req.body.userid
              }).save()
            ]);

            const payload = {
              userid: user.userid,
            _id: user._id
            };
            // Sign Token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: week },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              }
            );
          })
          .catch(err => console.log(err));
      }
    });
  })
);

//login endpoint
router.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    // expiration time
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;

    await User.findOne({ userid: req.body.userid })
      .then(user => {
        if (user) {
          // new Notifications({ user_id: req.body.userid }).save(); 
          const payload = {
            userid: user.userid,
            _id: user._id
          };
          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: week },
            (err, token) => {
              // console.log("token " + token);
              // console.log("user " + user);
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        }
      })
      .catch(err => console.log(err));
  })
);

router.delete(
  "/delete-user",
  requireAuth,
  asyncHandler(async (req, res, next) => {

            // post
            Promise.all([
              Post.deleteMany({ 
                 _owner: mongoose.Types.ObjectId(req.user._id),
              }, function (err) {
                console.log(err)
              }),
              Notifications.deleteOne({
                user_id: req.user.userid
              }, function (err) {
                console.log(err)
              }),
              Transaction.deleteOne({
                user_id: req.user.userid
              }, function (err) {
                console.log(err)
              }),
              User.deleteOne({
                userid: req.user.userid
              }, function (err) {
                console.log(err)
              }),
              ]).then(data=>{
                console.log("done ", data)
                 res.status(200).send({success: "user deleted"})
              })
  }))

router.post(
  "/paypal-transaction-complete",
  requireAuth,
  asyncHandler(async (req, res, next) => {
      // 2a. Get the order ID from the request body
  const orderID = req.body.orderID;

  // 3. Call PayPal to get the transaction details
  let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);

  let order;
  try {
    order = await payPalClient.client().execute(request);
  } catch (err) {

    // 4. Handle any errors from the call
    console.error(err);
    return res.send(500);
  }

  // 5. Validate the transaction details are as expected
  if (order.result.purchase_units[0].amount.value !== req.body.payment.amount) {
    return res.status(200).send("Transaction Error");
  }

  // 6. Save the transaction in your database
  // await database.saveTransaction(orderID);
  console.log("user ", req.user)
await addTransaction(req.user.userid, {
  orderID: orderID,
      amount: order.result.purchase_units[0].amount.value,
      points: req.body.payment.points,
})
   await User.findOneAndUpdate(
          { userid: req.user.userid },
          {
            $inc: {
              points: +parseInt(req.body.payment.points)
            }
          },
          {
            new: true
          }
        ).then(user => {
          if (user) {
            console.log("bout adding new notification details==> ", req.body)  
            addNotification(req.user.userid, {title: `👍 ${req.body.payment.points} Points Earned `, notificationType: "pointsGained"})

            res.status(200).send({
              success: "Transaction Successful",
              points: user.points
            });
          }
        }).catch(err=>{
          console.log(err)
        });

  }))
// check if user exists
router.get(
  "/check-user/:id",
  asyncHandler(async (req, res, next) => {
    await User.findOne({
      userid: req.params.id
    })
      .then(user => {
        if (user) {
          res.json(true);
        } else {
          res.json(false);
        }
      })
      .catch(err => console.log(err));
  })
);

router.get(
  "/get-points/:user_id",
  asyncHandler(async (req, res, next) => {
    User.findOne(
      { _id: mongoose.Types.ObjectId(req.params.user_id) },
      "points",
      function(err, user) { 
        if (err) return console.log(err);
        res.status(200).json(user.points);
      }
    );
  })
);

router.post(
  "/get-profile/:key",
  asyncHandler(async (req, res, next) => {
    const random = TWITTER_KEYS[req.params.key];
    var client = new Twitter({
      consumer_key: random.consumerKey,
      consumer_secret: random.consumerSecret,
      access_token_key: req.body.accessToken,
      access_token_secret: req.body.secret
    });
    const params = {
      user_id: req.body.userid
    };

    client.get("users/show", params, function(error, profile, response) {
      if (!error && response.statusCode === 200) {
        client = null;
        res.status(200).json({
          name: profile.name,
          screen_name: profile.screen_name,
          description: profile.description,
          followers: profile.followers_count,
          following: profile.friends_count,
          background_photo: profile.profile_background_image_url_https,
          photo: profile.profile_image_url_https.replace("_normal", ""),
          tweets: profile.statuses_count
        });
      } else {
        if (
          error[0] !== undefined &&
          error[0].code !== undefined &&
          parseInt(error[0].code) === 89
        ) {
          // if token is expired notify client to loout
          // errorCode: parseInt(error[0].code) === 89,

          res.status(500).send({
            errorCode: parseInt(error[0].code),
            errorMessage: error[0].message
          });
        }
        // either has an error or returned status code not equals 200
        console.log(error);
      }
    });
  })
);

module.exports = router;
