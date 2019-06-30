const http = require("http");
const app = require("./server/app");

const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);
const { follow, unFollow, lookup } = require("./server/utils/usersUtil");
const {
  getNotifications,
  markAsRead,
  clear
} = require("./server/utils/NotificationsUtil");
const { seed } = require("./server/utils/usersUtil");
users = [];
// seed(users);

io.sockets.on("connection", socket => {
  console.log("Socket connected ", socket.id);

  socket.on("push-user-info", userInfo => {
    userInfo.socketId = socket.id;
    socket.userInfo = userInfo;
    users.unshift(userInfo);
    // users = seed;
    console.log(userInfo);
    console.log("current users length " + users.length);
  });
  socket.emit("get-user-info", {}, userInfo => {
    userInfo.socketId = socket.id;
    socket.userInfo = userInfo;
    users.unshift(userInfo);
    // users = seed;
    console.log(userInfo);
    console.log("current users length " + users.length);
  });

  socket.on("get-users", (info, callback) => {
    lookup(
      info,
      users.slice(info.currentUsers, 10 * (info.page + 1)),
      callback
    );
    callback(users.slice(info.currentUsers, 10 * (info.page + 1)));
  });

  socket.on("get-notifications", (user_id, callback) => {
    getNotifications(user_id, callback);
  });
  socket.on("mark-as-read", user_id => {
    markAsRead(user_id);
  });
  socket.on("clear-notifications", user_id => {
    clear(user_id);
  });
  socket.on("follow", async (info, callback) => {
    await follow(info, callback, socket);
    io.to(`${info.newUser.socketId}`).emit("followed", {
      user: socket.userInfo
    });
  });
  socket.on("unfollow", (info, callback) => {
    unFollow(info, callback, socket);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    if (socket.userInfo) {
      users.splice(users.indexOf(socket.userInfo));
    }
    console.log("remaining users length " + users.length);
  });
});

server.listen(8080, () => {
  console.log("listening");
});
