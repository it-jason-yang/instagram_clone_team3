const logger = require("../../config/logger");
const { Reply } = require("../../models");

const replyOutPut = {
  getReply: async (req, res) => {
    try {
      const { postId } = req.params;
      const reply = await Reply.findAll({
        order: [["date", "DESC"]],
        where: { postId },
      });
      logger.info(
        `GET /replyList/:postId 200 "${reply.length}개의 댓글을 조회했습니다." `
      );
      res.status(200).send({ result: reply });
    } catch (err) {
      logger.error(`GET /replyList/:postId 400 "msg: ${err}"`);
      res.status(400).send({ msg: "댓글 작성에 실패했습니다." });
    }
  },
};

const replyProcess = {
  createReply: async (req, res) => {
    try {
      const { userNameId } = res.locals.userId;
      const { postId } = req.params;
      const { comment } = req.body;
      const date = new Date();
      const reply = await Reply.create({
        postId,
        userId: userNameId,
        comment,
        date,
      });
      logger.info(
        `POST /replyPost/:postId 200 "${userNameId}님이 댓글을 등록했습니다." `
      );
      res.status(200).send({ result: reply, msg: "댓글을 등록했습니다." });
    } catch (err) {
      console.log(err);
      logger.error(`POST /replyPost/:postId 400 "msg: ${err}"`);
      res.status(400).send({ msg: "댓글 작성에 실패했습니다." });
    }
  },

  updateReply: async (req, res) => {
    try {
      const { userNameId } = res.locals.userId;
      const { replyId } = req.params;
      const { comment } = req.body;
      const reply = await Reply.findByPk(replyId);
      if (reply) {
        if (userNameId == reply.userId) {
          await Reply.update({ comment }, { where: { replyId } });
          logger.info(
            `PUT /replyUpdate/:replyId 200 "${userNameId}님이 댓글을 수정했습니다." `
          );
          res.status(200).send({ msg: "댓글이 정상적으로 수정되었습니다." });
        } else {
          logger.info(
            `PUT /replyUpdate/:replyId 200 "${userNameId}님은 작성자가 아닙니다." `
          );
          res
            .status(200)
            .send({ msg: "댓글 수정은 작성자만 가능한 기능입니다." });
        }
      } else {
        logger.info(
          `PUT /replyUpdate/:replyId 200 "${userNameId}님의 댓글을 찾을 수 없습니다." `
        );
        res.status(200).send({ msg: "수정가능한 댓글이 없습니다." });
      }
    } catch (err) {
      logger.error(`PUT /replyUpdate/:replyId 400 "msg: ${err}"`);
      res.status(400).send({
        msg: "알 수 없는 문제가 발생했습니다. 관리자에게 문의해주세요",
      });
    }
  },
  removeReply: async (req, res) => {
    try {
      const { userNameId } = res.locals.userId;
      const { replyId } = req.params;
      const reply = await Reply.findByPk(replyId);
      if (reply) {
        if (userNameId == reply.userId) {
          await Reply.destroy({ where: { replyId } });
          logger.info(
            `DELETE /replyDelete/:replyId 200 "${userNameId}님이 댓글을 삭제했습니다." `
          );
          res.send({
            msg: "댓글이 삭제되었습니다.",
          });
        } else {
          logger.info(
            `DELETE /replyDelete/:replyId 200 "${userNameId}님은 작성자가 아닙니다." `
          );
          res
            .status(400)
            .send({ msg: "댓글 작성자만 사용 가능한 기능입니다." });
        }
      } else {
        logger.info(
          `DELETE /replyDelete/:replyId 200 "${userNameId}님의 댓글을 찾을 수 없습니다." `
        );
        res.status(200).send({ msg: "삭제가능한 댓글이 없습니다." });
      }
    } catch (err) {
      logger.error(`DELETE /replyDelete/:replyId 400 "msg: ${err}"`);
      res.status(400).send({
        msg: "알 수 없는 문제가 발생했습니다. 관리자에게 문의해주세요",
      });
    }
  },
};

module.exports = {
  replyOutPut,
  replyProcess,
};
