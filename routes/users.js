const express = require("express");
const router = express.Router();
const { User } = require("../models"); //구조분해할당
const { Op } = require("sequelize");
const bcrypt = require("bcrypt"); //include the bcrypt module
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const authMiddlewares = require("../middlewares/auth-middlewares");
// const plainPassword = "dkssud1234"
dotenv.config();

//user(register) router api create
router.route("/users/register").post(async (req, res) => {
  try {
    const { userId, userName, userNameId, userPw } = req.body;
    const users = await User.findAll({
      where: {
        [Op.or]: [{ userId }, { userNameId }],
      },
    });

    //해당 길이의 배열이 0일때 => 중복된 사용자가 없음
    if (users.length == 0) {
      //password(userPw) encryption
      const saltRounds = Number("process.env.SALTROUNDS");
      const encryptedPw = bcrypt.hashSync(userPw, saltRounds);
      console.log(encryptedPw);
      const user = await User.create({
        userId,
        userName,
        userNameId,
        userPw: encryptedPw,
      });
      res.status(200).send({ result: user, msg: "회원가입에 성공했습니다" });
    } else {
      //입력정보에 해당 사용자 이름이 있을때
      res
        .status(200)
        .send({
          msg: "이미 사용중인 이메일, 전화번호 또는 사용자 이름이 있습니다",
        });
    }
  } catch (err) {
    res
      .status(400)
      .send({ msg: "알 수 없는 문제가 생겼습니다. 관리자에게 문의해 주세요" });
  }
});

//user(login) router api create
router.route("/users/login").post(async (req, res) => {
  try {
    const { loginId, userPw } = req.body;
    const users = await User.findOne({
      where: {
        [Op.or]: [{ userId: loginId }, { userNameId: loginId }],
      },
    });

    if (!users || !bcrypt.compareSync(userPw, users.userPw)) {
      res.status(200).send({ msg: "아이디 또는 패스워드가 일치하지 않습니다" });
    } else {
      const token = jwt.sign({ userId: users.Id }, process.env.TOKEN_KEY); //토큰값 설정
      res.status(200).send({ token, msg: "로그인에 성공했습니다" }); //토큰값 저장
    }
  } catch (err) {
    res
      .status(400)
      .send({ msg: "알 수 없는 문제가 생겼습니다. 관리자에게 문의해 주세요" });
  }
});

router.get("/users/me", authMiddlewares, async (req, res) => {
  res.status(400).send({ user : res.locals.user });
});

module.exports = router;
