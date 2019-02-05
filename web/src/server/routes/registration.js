var express = require('express')
var router = express.Router()

/* GET users listing. */
router.get('/', function(req, res, next) {
  const options = {
    title: 'Register'
  }
  res.render('register', options)
})

module.exports = router
