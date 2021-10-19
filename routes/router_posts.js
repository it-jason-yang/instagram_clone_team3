const express = require('express');
const router = express.Router();
const { Posts, sequelize, Sequelize } = require('../models');
// const authMiddleware = require('../middlewares/auth_middleware');
const fs = require('fs');
const multer = require('multer'); //form data 처리를 할수 있는 라이브러리 multer
// const multerS3 = require('multer-s3'); // aws s3에 파일을 처리 할수 있는 라이브러리 multer-s3
// const AWS = require('aws-sdk'); //javascript 용 aws 서비스 사용 라이브러리
const path = require('path'); //경로지정
const randomstring = require("randomstring");

try{
  fs.readdirSync('uploads'); //readdir 첫번째 인자로 폴더를 가져온다
}catch(error) {
  console.log('uploads 폴더가 없으면 생성');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, '${__dirname}/../public/uploads');
    },
    filename(req, file, cb) {
      const fileName = randomstring.generate(20);
      const ext = path.extname(file.originalname);
      cb(null, fileName + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024},
});

const upload2 = multer();
//upload.array('img',3) 여러개 업로드 시
router.post('/img', upload.single('img'), async(req,res) => {
  // const { userId } = res.locals.user; //로그인 정보에서 가져온다.
  const userId = 'jason@naver.com'; //테스트위해 하드코딩으로 아이디 지정
  const { postContents } = req.body;
  const image = req.file.path;
  console.log(req.file.path)
  console.log(req.body)
  try{
    const posts = await Posts.create({
      userId,
      postContents,
      postImg:image,
    });

    res.status(200).send({ msg: '게시글 작성에 성공하였습니다.' });
  }catch(error){
    console.log(error);
    res.status(400).send({ msg: '게시글 작성에 실패하였습니다.' });
  }
})

// //게시글 등록 body 로 이미지 받는 방식
// router.post('/create', async (req, res) => {
//   try {
//     // const { userId } = res.locals.user; //로그인 정보에서 가져온다.
//     const userId = 'jason@naver.com';
//     const { image, postContents } = req.body;
    
//     const userName = 'jason'
//     await Posts.create({ userId, image, postContents });

//     res.status(200).send({ msg: '게시글 작성에 성공하였습니다.' });
//   } catch (error) {
//     console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
//     res.status(401).send({ msg: '게시글 작성에 실패하였습니다.' });
//   }
// });

//팔로우 컬럼 별도로 파서 팔로우하는 계정 글만 보여주는 경우 활용
const img_join = `
        SELECT p.postId, p.userId, p.postContents, p.image, p.date p.createdAt, p.updatedAt
        FROM Posts AS p
        JOIN Images AS I
        ON p.userId = u.userId
        ORDER BY p.postId DESC`;
        
//게시글 받아와서 뿌리기
router.get('/', async (req, res) => {
  try {
    //const posts = await Posts.find({}).sort({ postId: -1 });
    const postQuery = `
            SELECT p.postId, p.userId, p.postContents, p.postImg
            FROM Posts AS p
            ORDER BY p.postId DESC`;

    const posts = await sequelize.query(postQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    res.send({ result: posts });
  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    res.status(400).send({
      msg: '전체 게시글 조회에 실패했습니다.',
    });
  }
});

//게시글 삭제
router.delete('/:postId/delete', async (req, res) => {
  console.log('delete 진입')
  const postId = req.params.postId;
  // const { userId } = res.locals.user; //로그인 정보에서 가져온다.
  const userId = 'jason@naver.com'; //테스트위해 하드코딩으로 아이디 지정
  try {
    isExist = await Posts.findOne({ where: {postId} });
      if (isExist.length !== 0 && userId == isExist.userId) {
        await Posts.destroy({ where: {postId} });
        return res.send({ result: "포스팅 삭제 완료!" });
      } else {
        return res.send({ result: "해당 포스팅이 존재하지 않거나 삭제할 수 없습니다." });
      }
      res.status(200).send({
        msg: '게시글을 삭제했습니다.',
      });

  }catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(200).send({
        msg: '알 수 없는  문제가 발생했습니다.',
      });
    }
});
module.exports = router;
