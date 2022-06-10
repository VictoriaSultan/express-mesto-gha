const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/secretKey");

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new UnauthorizedError("Необходима авторизация"));
  } else {
    const token = req.cookies.jwt;
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      next(new UnauthorizedError("JWT авторизация не прошла."));
    }
    req.user = payload;
    next();
  }
};
