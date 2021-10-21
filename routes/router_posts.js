const express = require('express');
const router = express.Router();
const { Posts, sequelize, Sequelize } = require('../models');
const fs = require('fs');
const authMiddlewares = require("../middlewares/auth-middlewares");
const {addPosting, upload,resizeImg} = require('../controllers/router_posts');

exports.testfn = (param) => {
  if (param == 1) {
    return true;
  }else{
    return false;
  }
}

//스테틱 디렉토리 생성
try{
  fs.readdirSync('public/uploads'); //readdir 첫번째 인자로 폴더를 가져온다
}catch(error) {
  console.log('uploads 폴더가 없으면 생성');
  fs.mkdirSync('public/uploads');
}

//파일 업로드
//upload.array('img',3) 여러개 업로드 시
router.post('/posts/create', authMiddlewares, upload.single('img'), addPosting);

//팔로우 컬럼 별도로 파서 팔로우하는 계정 글만 보여주는 경우 활용
const img_join = `
        SELECT p.postId, p.userId, p.postContents, p.image, p.date p.createdAt, p.updatedAt
        FROM Posts AS p
        JOIN Images AS I
        ON p.userId = u.userId 
        ORDER BY p.postId DESC`;
        
//게시글 받아와서 뿌리기
router.get('/posts', async (req, res) => {
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
router.delete('/posts/:postId/delete', authMiddlewares, async (req, res) => {
  console.log('delete 진입')
  const postId = req.params.postId;
  // const { userId } = res.locals.user; //로그인 정보에서 가져온다.
  const userId = 'jason@naver.com'; //테스트위해 하드코딩으로 아이디 지정
  try {
    isExist = await Posts.findOne({ where: {postId} });
      if (isExist.length !== 0 && userId == isExist.userId) {
        await Posts.destroy({ where: {postId} });
        return res.status(200).send({ msg: "포스팅 삭제 완료!" });
      } else {
        return res.status(400).send({ msg: "해당 포스팅이 존재하지 않거나 삭제할 수 없습니다." });
      }

  }catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).send({msg: '알 수 없는 문제가 발생했습니다.'});
    }
});

//게시글 수정
router.put("/posts/:postId/modify", authMiddlewares, upload.single('img'), async (req, res, next) => {
  console.log('modify 진입')

  // const { userId } = res.locals.user; //로그인 정보에서 가져온다.
  const userId = 'jason@naver.com'; //테스트위해 하드코딩으로 아이디 지정
  const postId = req.params.postId;
  const { postContents } = req.body;
  let image = '';
  const date = new Date();

  if(req.file == undefined){
    image = ''; //없는 경우 현재는 공란. 필요 시 기본이미지 넣어주자
  }else{
    image = req.file.path;
  }
  
  try {
    if (image) {
      resizeImg(req.file.path);
    }

    //postsId가 존재하는지 null 체크
    if (postId == null) {
      return res.send({ result: "해당 포스팅이 존재하지 않습니다." })
    }

    //postsId가 존재하는지 db 체크
    isExist = await Posts.findOne({where: {postId}});
    if (isExist.length !== 0 && userId == isExist.userId) {

      (function (beforeImg) {
        fs.unlink(beforeImg, (err) => err ? console.log(err) : console.log('이미지 정상 삭제'))
      }(isExist.dataValues.postImg));

      await Posts.update(
        {
          postContents,
          postImg:image,
          date
        },
        {
          where:{
            postId: postId,
          }
        }
      );

      return res.status(200).send({ msg: "포스팅 수정 완료!" });    
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ msg: "해당 포스팅이 존재하지 않습니다." });
  }
});

module.exports = router;