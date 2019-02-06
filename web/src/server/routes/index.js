const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  const options = {
    title: 'Project Danger',
    bundles: req.app.locals.bundles
  }
  res.render('index', options)
})

module.exports = router
