const app = require("./server");
const dotenv = require("dotenv");
const routers = require('./routes'); // 통신을 수행하는 Router 생성
dotenv.config();
const port = process.env.EXPRESS_PORT;
const express = require('express');
const cors = require('cors'); //cors!! 프론트에서 접근 할때 허용하기 위한 설정
const cookieParser = require('cookie-parser');

app.use('/api', routers); // 라우터 폴더 적용


//test용 시작
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});
//test용 끝



app.listen(port, () => console.log(`서버 연결 port ${port}`));
