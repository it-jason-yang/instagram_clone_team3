const { Like } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const { userId } = res.locals.userId;

    await Like.findAll({ where: { userId } }).then((likes) => {
      res.likesList = likes;
      next();
    });
  } catch (error) {
    console.log(error);
  }
};
