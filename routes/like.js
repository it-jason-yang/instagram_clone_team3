const express = require("express");
const router = express.Router();
const { Like } = require("../models");
const { Op } = require("sequelize");

router.post("/likes/:postId", async (req, res) => {
  try {
    // const {userId} = res.locals.userId
    const { postId } = req.params;
    const userId = "user1";
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
      res.status(200).send({ result: like, msg: "좋아요 완료" });
    } else {
      res.status(200).send({ msg: "좋아요는 한번만 할 수 있습니다." });
    }
  } catch (err) {
    res
      .status(400)
      .send({ msg: "알 수 없는 문제가 발생 했습니다. 관리자에 문의 해주세요" });
  }
});

//좋아요 조회
router.get("/likes/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const likeUser = await Like.findAll({
      where: { postId },
    });
    const likeNum = likeUser.length;
    if (likeNum > 0) {
      res.status(200).send({ result: likeNum, msg: "좋아요 취소" });
    } else {
      res.status(200).send({ msg: "좋아요를 한 사람이 없습니다." });
    }
  } catch (err) {
    res
      .status(400)
      .send({ msg: "알 수 없는 문제가 발생 했습니다. 관리자에 문의 해주세요" });
  }
});

//좋아요 삭제
router.delete("/likes/:postId", async (req, res) => {
  try {
    // const {userId} = res.locals.userId
    const { postId } = req.params;
    const userId = "user1";
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
      res.status(200).send({ msg: "좋아요를 취소 했습니다." });
    } else {
      res.status(200).send({ msg: "좋아요를 한 상태에만 가능한 기능입니다." });
    }
  } catch (err) {
    res.status(400).send({ msg: "알 수 없는 문제가 발생했습니다." });
  }
});

module.exports = router;
