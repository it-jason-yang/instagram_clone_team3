var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const router_posts = require('./router_posts');
router.use('/posts', router_posts);

module.exports = router;
