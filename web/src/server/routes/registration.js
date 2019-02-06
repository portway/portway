const express = require('express')
const router = express.Router()

/* GET users listing. */
router.get('/', (req, res, next) => {
  const options = {
    title: 'Register'
  }
  res.render('register', options)
})

module.exports = router
