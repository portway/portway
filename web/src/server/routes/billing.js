const express = require('express')
const router = express.Router()
const apiUrl = process.env.API_URL

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('billing', { apiUrl })
})

module.exports = router
