const http = require("http");
const app = require("./server/app");

const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);
const { follow, unFollow, lookup } = require("./server/routes/api/usersUtil");
users = [];
io.sockets.on("connection", socket => {
  console.log("Socket connected ", socket.id);

  socket.on("go-online", userInfo => {
    socket.userInfo = userInfo;
    console.log(userInfo);
    users.push(userInfo);
    console.log("current users length " + users.length);
    // socket.emit("users", users.slice(0, 10));
  });

  socket.on("get-users", (info, callback) => {
    lookup(users.slice(info.currentUsers, 10 * (info.page + 1)), callback);
  });
  socket.on("follow", (info, callback) => {
    follow(info, callback);
  });
  socket.on("unFollow", (info, callback) => {
    unFollow(info, callback);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    users.splice(users.indexOf(socket.userInfo));
    console.log("remaining users length " + users.length);
  });
});

server.listen(8080, () => {
  console.log("listening");
});
