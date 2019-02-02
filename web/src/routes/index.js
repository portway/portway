var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  const options = {
    title: 'Express',
    bundles: req.app.locals.bundles
  }
  res.render('index', options)
})

module.exports = router
