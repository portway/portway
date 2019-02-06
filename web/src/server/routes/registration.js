const express = require('express')
const router = express.Router()

/* GET users listing. */
router.get('/', (req, res, next) => {
  const options = {
    title: 'Register',
    css: req.app.locals.bundles.registration.css,
    vendor: req.app.locals.bundles.vendor.js,
    js: req.app.locals.bundles.registration.js
  }
  res.render('register', options)
})

module.exports = router
