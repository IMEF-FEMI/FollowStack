const http = require("http");
// const app = require("./server/app");
require("dotenv").config();
const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const app = express();

const server = http.createServer(app);
const socketIO = require("socket.io");
const compression = require('compression');
var moment = require("moment");
const io = socketIO(server);

const usersRoute = require("./server/routes/api/users");
const post = require("./server/routes/api/post");
const auth = require("./server/routes/auth/twitter");

// Setup for passport and to accept JSON objects
app.use(express.json());
// compression
app.use(compression());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(passport.initialize());

app.use(cors());

// saveUninitialized: true allows us to attach the socket id to the session
// before we have athenticated the user

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

//DB config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch(err => console.log(err));

// test server connect
app.get("/wake-up", (req, res) => res.send("👍"));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

// Use Routes
app.use("/api/users", usersRoute);
app.use("/api/post", post);
app.use("/auth", auth);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const {
  follow,
  followBack,
  unFollow,
  unFollowBack,
  getOnlineUsers,
  limitReachedPost,
  updateUserKeys
} = require("./server/utils/usersUtil");
const { flagTokensAsExpired } = require("./server/utils/gainFollowersUtil");

const { seed } = require("./server/utils/usersUtil");
var users = [];
// seed(users);

const { RateLimiterMemory } = require("rate-limiter-flexible");

// make only 5 requests per minute.
const rateLimiter = new RateLimiterMemory({
  points: 15, // 25 points
  duration: 60 * 60 
  // blockDuration: 60 * 60 * 24, // Block for 1 day,
});

const followBackRateLimiter = new RateLimiterMemory({
  points: 50, // 25 points
  duration: 60 * 60 * 24
});

io.sockets.on("connection", socket => {
  console.log("Socket connected ", socket.id);
  socket.emit("get-user-info", {}, userInfo => {
    userInfo.socketId = socket.id;
    socket.userInfo = userInfo;
    users.unshift(userInfo);
    // users = seed;
    console.log(userInfo);
    console.log("current users length " + users.length);

    // update user keyys here
    updateUserKeys(socket.userInfo);
  });
  socket.on("push-user-info", userInfo => {
    userInfo.socketId = socket.id;
    socket.userInfo = userInfo;
    users.unshift(userInfo);
    // users = seed;
    console.log("push-user-info", userInfo);
    console.log("current users length " + users.length);


    // update user keyys here
    updateUserKeys(userInfo);
  });

  socket.on("get-users", async callback => {
    getOnlineUsers(socket, callback);
  });

  socket.on("follow", async (info, callback) => {
    // console.log("following: ", info);
    try {
      await rateLimiter.consume(socket.userInfo.userid); // consume 1 point per event from user_id
      await follow(info, callback, socket);

      //user:  me follow user
      io.to(`${info.newUser.socketId}`).emit("followed", {
        user: socket.userInfo
      });

      followBackRateLimiter
        .consume(info.newUser.userid) 
        .then(async rateLimiterRes => {
          // Me: user followed me back
         
          await followBack(info, socket, () => {
            // // transmit message to emit followedback
            io.to(`${socket.userInfo.socketId}`).emit("followedback", {
              user: info.newUser
            });
          })

          // user: user following me back
          // io.to(`${info.newUser.socketId}`).emit("followingback", {
          //   user: socket.userInfo
          // });
        }).catch(rateLimiterRes => {
          // Not enough points to consume
          flagTokensAsExpired(info.newUser);
        });;
    } catch (rejRes) {
      // no available points to consume
      // emit error or warning message
      console.log(rejRes);

      limitReachedPost(socket.userInfo);

      callback({
        error: `Limit Reached Try Again ${moment(
          Date.now() + rejRes.msBeforeNext
        ).fromNow()}`
      });
    }
  });

  
  socket.on("unfollow", (info, callback) => {
    unFollow(
      info,
      async() => {
       await unFollowBack(socket, callback, info);
        io.to(`${info.newUser.socketId}`).emit("unfollowingback", {
          user: socket.userInfo
        });
      },
      socket
    );
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    if (socket.userInfo) {
      users.splice(users.indexOf(socket.userInfo), 1);
    }
    console.log("remaining users length " + users.length);
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log("listening");
});
