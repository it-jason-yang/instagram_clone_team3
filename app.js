const app = require("./server");
const logger = require("./config/logger");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.EXPRESS_PORT;

//test용 시작 view page
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});
//test용 끝

app.listen(port, () => {
  logger.info(`${port} 포트에서 서버가 가동되었습니다.`);
});
