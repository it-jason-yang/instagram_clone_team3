const logger = require("../../config/logger");
const { Like } = require("../../models");
const { Op } = require("sequelize");

const likeOutPut = {
  getLike: async (req, res) => {
    try {
      const { postId } = req.params;
      const likeUser = await Like.findAll({
        where: { postId },
      });

      if (likeUser) {
        const likeNum = likeUser.length;
        logger.info(
          `GET /likes/:postId 200 "postId가 ${postId}의 글에 ${likeNum}개의 좋아요가 있습니다." `
        );
        res
          .status(200)
          .send({ result: likeNum, msg: "좋아요 갯수를 불러왔습니다." });
      } else {
        logger.info(
          `GET /likes/:postId 200 "postId가 ${postId}의 글에 좋아요를 한 사람이 없습니다." `
        );
        res.status(200).send({ msg: "좋아요를 한 사람이 없습니다." });
      }
    } catch (err) {
      logger.info(`GET /likes/:postId 400 "msg:${err}"`);
      res.status(400).send({
        msg: "알 수 없는 문제가 발생 했습니다. 관리자에 문의 해주세요",
      });
    }
  },
};

const likeProcess = {
  createLike: async (req, res) => {
    try {
      const { userId } = res.locals.userId;
      const { postId } = req.params;
      const likeUser = await Like.findOne({
        where: {
          [Op.and]: [{ userId }, { postId }],
        },
      });
      if (!likeUser) {
        const like = await Like.create({
          postId,
          userId,
        });
        logger.info(
          `GET /likes/:postId 200 "postId가 ${postId}의 글에 ${userId}님이 좋아요를 했습니다." `
        );
        res.status(200).send({ result: like, msg: "좋아요 완료" });
      } else {
        logger.info(
          `POST /likes/:postId 200 "postId가 ${postId}의 글에 ${userId}님은 이미 좋아요를 했습니다. 한번만 가능합니다." `
        );
        res.status(200).send({ msg: "좋아요는 한번만 할 수 있습니다." });
      }
    } catch (err) {
      logger.info(`POST /likes/:postId 400 "msg:${err}"`);
      res.status(400).send({
        msg: "알 수 없는 문제가 발생 했습니다. 관리자에 문의 해주세요",
      });
    }
  },
  removeLike: async (req, res) => {
    try {
      const { userId } = res.locals.userId;
      const { postId } = req.params;
      const likeUser = await Like.findOne({
        //findOne을 쓸 경우 length를 못 가져오더라.. 1개만 찾는데 length를 찾는다는게 말이 안되나봄
        where: {
          [Op.and]: [{ userId }, { postId }],
        },
      });
      if (likeUser) {
        await Like.destroy({
          where: {
            [Op.and]: [{ userId }, { postId }],
          },
        });
        logger.info(
          `DELETE /likes/:postId 200 "postId가 ${postId}의 글에 ${userId}님이 좋아요를 취소 했습니다." `
        );
        res.status(200).send({ msg: "좋아요를 취소 했습니다." });
      } else {
        logger.info(
          `DELETE /likes/:postId 200 "postId가 ${postId}의 글에 ${userId}님이 좋아요를 한적이 없습니다." `
        );
        res
          .status(200)
          .send({ msg: "좋아요를 한 상태에만 가능한 기능입니다." });
      }
    } catch (err) {
      logger.info(`DELETE /likes/:postId 400 "msg:${err}"`);
      res.status(400).send({ msg: "알 수 없는 문제가 발생했습니다." });
    }
  },
};

module.exports = {
  likeProcess,
  likeOutPut,
};
