const jwt = require("jsonwebtoken");
const authConfig = require("../config/authConfig.js");

exports.verifyToken = (request, res, next) => {
    let token = request.headers["x-access-token"];

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
      request.userId = decoded.id;
      request.user_id = decoded.id;
      next();
    });
};