const express = require("express");
const router = express.Router();
const likeCtrl = require("../controllers/likes/like-ctrl");
const authMiddlewares = require("../middlewares/auth-middlewares");

postLike = likeCtrl.likeProcess;
outputLike = likeCtrl.likeOutPut;
//좋아요 추가
router.post("/likes/:postId", authMiddlewares, postLike.createLike);
//좋아요 조회
router.get("/likes/:postId", outputLike.getLike);
//좋아요 삭제
router.delete("/likes/:postId", authMiddlewares, postLike.removeLike);

module.exports = router;
