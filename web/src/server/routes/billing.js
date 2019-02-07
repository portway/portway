var express = require('express')
var router = express.Router()
const apiUrl = process.env.API_URL

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('billing', { apiUrl })
})

module.exports = router