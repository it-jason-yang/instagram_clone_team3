const { Posts, sequelize, Sequelize } = require('../models');
const fs = require('fs');
const multer = require('multer'); //form data 처리를 할수 있는 라이브러리 multer
const path = require('path'); //경로지정
const randomstring = require("randomstring");
const sharp = require("sharp");

//upload 변수 내 multer파일 생성규칙 설정
exports.upload = multer({
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
}

exports.addPosting = async(req,res) => {
  // const { userId } = res.locals.user; //로그인 정보에서 가져온다.
  const userId = 'jason@naver.com'; //테스트위해 하드코딩으로 아이디 지정
  const { postContents } = req.body;
  let image = '';
  const date = new Date();

  if(req.file == undefined){
    image = ''; //없는 경우 현재는 공란. 필요 시 기본이미지 넣어주자
  }else{
    image = req.file.path;
  }

//게시글 생성 및 파일 크기조정
  try{
    //이미지 가로크기 조정하여 덮어씌우기 (이미지 있는 경우만)
    if (image) {
      resizeImg(req.file.path);
    }

    const pathCutImg = image.substr(6);

    const posts = await Posts.create({
      userId,
      postContents,
      postImg:pathCutImg,
      date,
    });

    res.status(200).send({ msg: '게시글 작성에 성공하였습니다.' });
  }catch(error){
    console.log(error);
    res.status(400).send({ msg: '게시글 작성에 실패하였습니다.' });
  }
}