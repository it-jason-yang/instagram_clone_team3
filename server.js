const express = require("express");
const logger = require("morgan");
<<<<<<< HEAD
const app = express();
const postsRouter = require('./routes/router_posts');
const cors = require("cors");
=======
const postsRouter = require('./routes/router_posts');
const cors = require("cors");
const replesRouter = require("./routes/reples");
const likeRouter = require("./routes/like");
const usersRouter = require("./routes/users");
const app = express();
//react 연결지워야할 것
// app.use("/", (req, res) => {
//     return res.send(express.static(path.join(__dirname, "client/index.html")));
//   });
>>>>>>> bfd357fb6507c4b410a781e7c0f3897a504a4897

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('public'));

//routing
<<<<<<< HEAD
app.use('/posts', postsRouter);

=======
app.use('/api', postsRouter);
app.use("/api", usersRouter);
app.use("/api", replesRouter);
app.use("/api", likeRouter);
>>>>>>> bfd357fb6507c4b410a781e7c0f3897a504a4897

//Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
