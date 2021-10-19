const express = require("express");
const logger = require("morgan");
const app = express();
const usersRouter = require("./routes/users");
const cors = require("cors");

//react 연결지워야할 것
// app.use("/", (req, res) => {
//     return res.send(express.static(path.join(__dirname, "client/index.html")));
//   });
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('public'));

//routing
app.use("/api", usersRouter);


//Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
