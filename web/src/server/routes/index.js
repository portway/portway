var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  const options = {
    title: 'Project Danger',
    css: req.app.locals.bundles.index.css,
    vendor: req.app.locals.bundles.vendor.js,
    js: req.app.locals.bundles.index.js
  }
  res.render('index', options)
})

module.exports = router
