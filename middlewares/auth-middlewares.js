const jwt = require("jsonwebtoken");
const { User } = require("../models");

require("dotenv").config();

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  //console.log(authorization)
  const [tokenType, tokenValue] = (authorization || "").split(" ");
  console.log(tokenType);
  //console.log(tokenValue)
  if (tokenType !== "Bearer") {
    res.status(401).send({
      message: "로그인 후 이용 가능한 기능입니다",
    });
  }

  try {
    const { userId } = jwt.verify(tokenValue, process.env.TOKEN_KEY);

    User.findByPk(userId).then((user) => {
      res.locals.userId = user;
      console.log(user);
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "로그인 후 이용 가능한 기능입니다",
    });
    return;
  }
};
