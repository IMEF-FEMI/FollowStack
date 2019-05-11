module.exports = (req, res, next) => {
  if (!req.headers.authorization || req.headers.authorization=== "undefined" || req.headers.authorization === null) {
    return res.status(401).send({ error: "unauthorized Please Register" });
  }

  next();
};
