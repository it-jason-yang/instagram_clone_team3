const { Reply } = require("../models");

module.exports = async (req, res, next) => {
  try {
    await Reply.findAll().then((reples) => {
      res.replesList = reples;
      console.log(res.replesList);
      next();
    });
  } catch (error) {
    console.log(error);
  }
};
