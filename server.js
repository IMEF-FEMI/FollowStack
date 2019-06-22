const http = require("http");
const app = require("./server/app");

const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);
users = [];
io.sockets.on("connection", socket => {
  console.log("Socket connected ", socket.id);

  socket.on("go-online", userInfo => {
    socket.userInfo = userInfo;
    console.log(userInfo);
    users.push(userInfo);
    console.log(users.length);
    socket.emit("greet-from-server", userInfo);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    users.splice(users.indexOf(socket.userInfo));
    console.log(users.length);
  });
});

server.listen(8080, () => {
  console.log("listening");
});
