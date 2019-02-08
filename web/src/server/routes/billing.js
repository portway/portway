import express from 'express'
import constants from '../../shared/constants'

const router = express.Router()
const apiUrl = process.env.API_URL

/* GET home page. */
router.get('/', function(req, res, next) {
  const options = {
    title: `Billing – ${constants.PRODUCT_NAME}`,
    css: req.app.locals.bundles.billing.css,
    vendor: req.app.locals.bundles.vendor.js,
    js: req.app.locals.bundles.billing.js,
    apiUrl: apiUrl
  }
  res.render('billing', options)
})

export default router
