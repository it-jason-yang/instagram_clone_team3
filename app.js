const app = require("./server");
const dotenv = require("dotenv");
const router = require("./routes");
const authMiddlewares = require("./middlewares/auth-middlewares");

dotenv.config();

const port = process.env.PORT;


app.listen(port, () => console.log(`서버 연결 port ${port}`));
