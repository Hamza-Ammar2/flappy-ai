var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Flappy AI' });
});

router.get('/play', (req, res, next) => {
  res.render('play', {title: "Flappy Bird"});
});

module.exports = router;
