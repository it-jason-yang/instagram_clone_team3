const express = require("express");
const router = express.Router();
const { Posts, sequelize, Sequelize } = require("../models");
const fs = require("fs");
const multer = require("multer"); //form data 처리를 할수 있는 라이브러리 multer
const path = require("path"); //경로지정
const randomstring = require("randomstring");
const sharp = require("sharp");
const authMiddlewares = require("../middlewares/auth-middlewares");
const likeCtrl = require("../controllers/likes/like-ctrl");

//스테틱 디렉토리 생성
try{
  fs.readdirSync('public/uploads'); //readdir 첫번째 인자로 폴더를 가져온다
}catch(error) {
  console.log('uploads 폴더가 없으면 생성');
  fs.mkdirSync('public/uploads');
}

//파일 생성규칙
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "${__dirname}/../public/uploads");
    },
    filename(req, file, cb) {
      const fileName = randomstring.generate(20);
      const ext = path.extname(file.originalname);
      cb(null, fileName + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

//리사이징 즉시실행함수
//게시글 등록 뿐아니라 수정 시에도 활용하기 위해 분리
const resizeImg = (path) => {
  sharp(path)
    .resize({ width: 100 }) //width 설정하면 height는 자동으로 맞춤
    .withMetadata()
    .toBuffer((err, buffer) => {
      if (err) throw err;
      fs.writeFile(path, buffer, (err) => {
        if (err) throw err;
      });
    });
};

//파일 업로드
//upload.array('img',3) 여러개 업로드 시
router.post(
  "/posts/create",
  authMiddlewares,
  upload.single("img"),
  async (req, res) => {
    const { userNameId } = res.locals.userId; //로그인 정보에서 가져온다.
    //const userId = 'jason@naver.com'; //테스트위해 하드코딩으로 아이디 지정
    const { postContents } = req.body;
    let image = "";
    const date = new Date();

    if (req.file == undefined) {
      image = ""; //없는 경우 현재는 공란. 필요 시 기본이미지 넣어주자
    } else {
      image = req.file.path;
    }

    //게시글 생성 및 파일 크기조정
    try {
      //이미지 가로크기 조정하여 덮어씌우기 (이미지 있는 경우만)
      if (image) {
        resizeImg(req.file.path);
      }

      const posts = await Posts.create({
        userId: userNameId,
        postContents,
        postImg: image,
        date,
      });

      res.status(200).send({ msg: "게시글 작성에 성공하였습니다." });
    } catch (error) {
      console.log(error);
      res.status(400).send({ msg: "게시글 작성에 실패하였습니다." });
    }
  }
);

//팔로우 컬럼 별도로 파서 팔로우하는 계정 글만 보여주는 경우 활용
// const img_join = `
//         SELECT p.postId, p.userId, p.postContents, p.image, p.date p.createdAt, p.updatedAt
//         FROM Posts AS p
//         JOIN Images AS I
//         ON p.userId = u.userId
//         ORDER BY p.postId DESC`;
        
//게시글 받아와서 뿌리기
router.get("/posts", async (req, res) => {
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
      msg: "전체 게시글 조회에 실패했습니다.",
    });
  }
});

//게시글 삭제
router.delete("/posts/:postId/delete", authMiddlewares, async (req, res) => {
  console.log("delete 진입");
  const postId = req.params.postId;
  const {userId} = res.locals.userId; //로그인 정보에서 가져온다.
  //const userId = 'jason@naver.com'; //테스트위해 하드코딩으로 아이디 지정
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
      res.status(400).send({msg: '알 수 없는  문제가 발생했습니다.'});
    }
    res.status(200).send({
      msg: "게시글을 삭제했습니다.",
    });
});

//게시글 수정
router.put("/posts/:postId/modify", authMiddlewares, upload.single('img'), async (req, res, next) => {
  console.log('modify 진입')

  const { userId } = res.locals.userId; //로그인 정보에서 가져온다.
  //const userId = 'jason@naver.com'; //테스트위해 하드코딩으로 아이디 지정
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

    try {
      if (image) {
        resizeImg(req.file.path);
      }

      //postsId가 존재하는지 null 체크
      if (postId == null) {
        return res.send({ result: "해당 포스팅이 존재하지 않습니다." });
      }

      //postsId가 존재하는지 db 체크
      isExist = await Posts.findOne({ where: { postId } });
      if (isExist.length !== 0 && userId == isExist.userId) {
        (function (beforeImg) {
          fs.unlink(beforeImg, (err) =>
            err ? console.log(err) : console.log("이미지 정상 삭제")
          );
        })(isExist.dataValues.postImg);

        await Posts.update(
          {
            postContents,
            postImg: image,
            date,
          },
          {
            where: {
              postId: postId,
            },
          }
        );

        return res.status(200).send({ msg: "포스팅 수정 완료!" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send({ msg: "해당 포스팅이 존재하지 않습니다.2" });
    }
  }
);

module.exports = router;
