const app = require("./server");
const logger = require("./config/logger");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;

app.listen(port, () => {
  logger.info(`${port} 포트에서 서버가 가동되었습니다.`);
});
