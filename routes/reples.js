const express = require("express");
const router = express.Router();
const { Reply } = require("../models");

// 댓글 등록
router.post("/replyPost/:postId", async (req, res) => {
  try {
    // const {userId} = res.locals.userId
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = "user1";
    const date = new Date();
    const reply = await Reply.create({
      postId,
      userId,
      comment,
      date,
    });
    res.status(200).send({ result: reply, msg: "댓글을 등록했습니다." });
  } catch (err) {
    res.status(400).send({ msg: "댓글 작성에 실패했습니다." });
  }
});

//댓글 조회
router.get("/replyList/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const reply = await Reply.findAll({
      order: [["date", "DESC"]],
      where: { postId },
    });
    res.status(200).send({ result: reply });
  } catch (err) {
    res.status(400).send({ msg: "댓글 작성에 실패했습니다." });
  }
});

//댓글 수정
router.put("/replyUpdate/:replyId", async (req, res) => {
  try {
    // const { userId } = res.locals.userId
    const userId = "user1";
    const { replyId } = req.params;
    const { comment } = req.body;
    const reply = await Reply.findByPk(replyId);
    if (userId == reply.userId) {
      await Reply.update({ comment }, { where: { replyId } });
      res.status(200).send({ msg: "댓글이 정상적으로 수정되었습니다." });
    }
  } catch (err) {
    res
      .status(400)
      .send({ msg: "알 수 없는 문제가 발생했습니다. 관리자에게 문의해주세요" });
  }
});

//댓글 삭제
router.delete("/replyDelete/:replyId", async (req, res) => {
  try {
    // const { userId } = res.locals.userId
    const userId = "user1";
    const { replyId } = req.params;
    const reply = await Reply.findByPk(replyId);
    if (userId == reply.userId) {
      await Reply.destroy({ where: { replyId } });
      res.send({
        msg: "댓글이 삭제되었습니다.",
      });
    } else {
      res.status(400).send({ msg: "댓글 작성자만 사용 가능한 기능입니다." });
    }
  } catch (err) {
    res
      .status(400)
      .send({ msg: "알 수 없는 문제가 발생했습니다. 관리자에게 문의해주세요" });
  }
});

module.exports = router;
