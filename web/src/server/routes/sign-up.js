import express from 'express'
import constants from '../../shared/constants'

const router = express.Router()

/* GET users listing. */
router.get('/', (req, res, next) => {
  const options = {
    title: `Sign up for ${constants.PRODUCT_NAME}`,
    css: req.app.locals.bundles['sign-up'].css,
    vendor: req.app.locals.bundles.vendor.js,
    js: req.app.locals.bundles['sign-up'].js
  }
  res.render('sign-up', options)
})

export default router
