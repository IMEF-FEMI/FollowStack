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
var moment = require("moment");
const io = socketIO(server);
const usersRoute = require("./server/routes/api/users");
const post = require("./server/routes/api/post");
const auth = require("./server/routes/auth/twitter");

// const usersOnline = require("./routes/api/usersOnline");

// Setup for passport and to accept JSON objects
app.use(express.json());
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
// app.use("/api/users-online", usersOnline);

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
  unFollow,
  followBack, 
  getOnlineUsers,
  // getFollowedBack,
  // getNotFollowingBack
} = require("./server/utils/usersUtil");

const { seed } = require("./server/utils/usersUtil");
var users = [];
// seed(users);

const { RateLimiterMemory } = require('rate-limiter-flexible');

// make only 5 requests per minute.
const rateLimiter = new RateLimiterMemory({
    points: 20, // 20 points
    duration: 60 * 60 * 24,
  // blockDuration: 60 * 60 * 24, // Block for 1 day,
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
  });
  socket.on("push-user-info", userInfo => {
    userInfo.socketId = socket.id;
    socket.userInfo = userInfo;
    users.unshift(userInfo);
    // users = seed;
    console.log(userInfo);
    console.log("current users length " + users.length);
  });

 

  socket.on("get-users", async (info, callback) => { 
   
        getOnlineUsers(
          socket,
          info,
          users.slice(info.currentUsers, 10 * (info.page + 1)),
          callback
        );
    }    
    // callback(users.slice(info.currentUsers, 10 * (info.page + 1)));
  );

  // socket.on("get-followed-back", (info, callback) => {
  //   getFollowedBack(info, callback);
  // });
  // socket.on("get-not-following-back", (info, callback) => {
  //   getNotFollowingBack(info, callback);
  // });
  // socket.on("clear-following", (info, callback) => {
  //   clearFollowings(info, callback);
  // });

  

  socket.on("follow", async (info, callback) => {
  try {

      await rateLimiter.consume(socket.userInfo.user_id); // consume 1 point per event from user_id
       await follow(info, callback, socket);

       // transmit message to the person u followed
    io.to(`${info.newUser.socketId}`).emit("followed", {
      user: socket.userInfo
    });

    // followback by the person u followed
    await followBack(info, socket, ()=>{
      // // transmit message to emit followedback
    io.to(`${socket.userInfo.socketId}`).emit("followedback", {
      user: info.newUser 
    });

    // transmit message to the person following you back emit followingback
    io.to(`${info.newUser.socketId}`).emit("followingback", {
      user: socket.userInfo
    });
    })
    

    } catch(rejRes) {
      // no available points to consume
      // emit error or warning message
      console.log(rejRes)
      callback({error: `Limit Reached Try Again ${moment((Date.now() + (rejRes.msBeforeNext))).fromNow()}`})
    }

  });
  socket.on("unfollow", (info, callback) => {
    unFollow(info, callback, socket);
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
