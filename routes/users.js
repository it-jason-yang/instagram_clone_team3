const express = require('express');
const router = express.Router();
const { User } = require('../models'); //구조분해할당
const { Op } = require("sequelize");
const bcrypt = require("bcrypt"); //include the bcrypt module
const saltRounds = 10; //stablize for the round to prevent attacks
const jwt = require("jsonwebtoken");
const authMiddleWare = require("../middlewares/auth-middlewares");
// const plainPassword = "dkssud1234"


//user(register) router api create
router.route('/users/register')
  .post(async (req, res) => {
    try {
      const { userId, userName, userNameId, userPw } = req.body;
      const exist = await User.findAll({
        where: {
          [Op.or]: [
            { userId }, { userNameId }
          ]
        }
      })
      //id 가 일치할 경우
      if (id === exist.userId || nameId === exist.userNameId) {
        return res.status(200).send({ msg: "이미 사용중인 아이디가 있습니다" });
      }
      //password(userPw) encryption
      const encryptedPw = bcrypt.hashSync(exist.userPw, saltRounds);
      exist.userPw = encryptedPw;

      const user = await User.create({
        userId, userName, userNameId, userPw
      })
      res.status(200).send({ msg: "회원가입에 성공했습니다" });
    } catch (err) {
      res.status(400).send({ msg: "알 수 없는 문제가 생겼습니다. 관리자에게 문의해 주세요" });
    }
  })

//user(login) router api create
router.route('/users/login')
  .post(async (req, res) => {
    try {
      const { loginId, userPw } = req.body;
      const users = await User.findOne({
        where: {
          [Op.or]: [
            { userId: loginId }, { userNameId: loginId }
          ]
        }
      });
      if (!users || userPw !== users.userPw) {
        res.status(200).send({ msg: "아이디 또는 패스워드가 일치하지 않습니다" });
      }
      res.status(200).send({ msg: "로그인에 성공했습니다" })
    } catch (err) {
      res.status(400).send({ msg: "알 수 없는 문제가 생겼습니다. 관리자에게 문의해 주세요" });
    }
    bcrypt.compare(exist.userPw, exist.user['userPw'], function (err, msg) {
      if (msg === true) {
        const token = jwt.sign({ userID: exist.userID }, process.env.TOKEN_KEY);
        res.status(200).send({
          token,
          Message: '해시값과 비밀번호 동일, 로그인 완료!'
        });
      } else {
        res.status(400).send({
          msg: "이메일 또는 패스워드가 잘못되었습니다"
        })
        return;
      }
    })
  })



