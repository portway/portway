var express = require('express')
var router = express.Router()

/* GET users listing. */
router.get('/', function(req, res, next) {
  const options = {
    title: 'Register',
    css: req.app.locals.bundles.registration.css,
    vendor: req.app.locals.bundles.vendor.js,
    js: req.app.locals.bundles.registration.js
  }
  res.render('registration', options)
})

module.exports = router
