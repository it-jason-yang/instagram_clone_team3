const express = require("express");
const router = express.Router();
const likeCtrl = require("../controllers/likes/like-ctrl");
const authMiddlewares = require("../middlewares/auth-middlewares");

router.post("/likes/:postId", authMiddlewares, likeCtrl.likeProcess.createLike);

//좋아요 조회
router.get("/likes/:postId", likeCtrl.likeProcess.getLike);

//좋아요 삭제
router.delete(
  "/likes/:postId",
  authMiddlewares,
  likeCtrl.likeProcess.removeLike
);

module.exports = router;
