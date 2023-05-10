const jwt = require("jsonwebtoken");
const authConfig = require("../config/authConfig.js");

exports.verifyToken = (req, res, next) => {
    let token = req.headers["X-ACCESS-TOKEN"];

    if (!token) {
        return res.status(402).send({
            code: 402,
            message: "No token provided!"
        });
    }
  
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
            code: 402,
            message: "Unauthorized!",
            error: err
        });
      }
      req.userId = decoded.id;
      next();
    });
};