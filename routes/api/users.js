const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const keys = require("../../config/keys");

// Load User && Follows model
const User = require("../../models/User");
const Follows = require("../../models/Follows");

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
            new Follows({
              username: req.body.username,
              user_id: req.body.userid
            }).save()
          ])

            const payload = {
              userid: user.userid
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
          const payload = {
            userid: user.userid
          };
          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: week },
            (err, token) => {
              console.log("token " + token);
              console.log("user " + user);
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
          console.log(true);
        } else {
          res.json(false);
          console.log(false);
        }
      })
      .catch(err => console.log(err));
  })
);

module.exports = router;
