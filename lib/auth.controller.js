const asyncHandler = require("express-async-handler");

exports.twitter = asyncHandler(async (req, res, next) => {
  console.log("we here at the fken callback");
  await sendToClientSocket(req, res, "twitter");
});

exports.facebook = asyncHandler(async (req, res, next) => {
  console.log("we here at the fken callback");
  await sendToClientSocket(req, res, "facebook");
});

exports.instagram = asyncHandler(async (req, res, next) => {
  console.log("we here at the fken callback");
  await sendToClientSocket(req, res, "instagram");
});

function sendToClientSocket(req, res, provider) {
  const io = req.app.get("io");
  io.in(req.session.socketId).emit(provider, req.user);
  res.end();
}
