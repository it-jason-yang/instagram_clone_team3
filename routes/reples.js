const express = require("express");
const router = express.Router();
const logger = require("../config/logger");
const { Reply } = require("../models");
const authMiddlewares = require("../middlewares/auth-middlewares");
const replyCtrl = require("../controllers/reples/reply-ctrl");

postReply = replyCtrl.replyProcess;
outputReply = replyCtrl.replyOutPut;

// 댓글 등록
router.post("/replyPost/:postId", authMiddlewares, postReply.createReply);

//댓글 조회
router.get("/replyList/:postId", outputReply.getReply);

//댓글 수정
router.put("/replyUpdate/:replyId", authMiddlewares, postReply.updateReply);

//댓글 삭제
router.delete("/replyDelete/:replyId", authMiddlewares, postReply.removeReply);

module.exports = router;
