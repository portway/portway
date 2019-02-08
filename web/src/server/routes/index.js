import express from 'express'
import constants from '../../shared/constants'

const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  const options = {
    title: constants.PRODUCT_NAME,
    css: req.app.locals.bundles.index.css,
    vendor: req.app.locals.bundles.vendor.js,
    js: req.app.locals.bundles.index.js
  }
  res.render('index', options)
})

export default router
