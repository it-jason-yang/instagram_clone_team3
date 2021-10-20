const express = require("express");
const replesRouter = require("./routes/reples");
const likeRouter = require("./routes/like");
const cors = require("cors");
const app = express();
//react 연결지워야할 것
// app.use("/", (req, res) => {
//     return res.send(express.static(path.join(__dirname, "client/index.html")));
//   });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//routing
app.use("/api", replesRouter);
app.use("/api", likeRouter);

//Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
