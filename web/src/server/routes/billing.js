import express from 'express'
import constants from '../../shared/constants'
import { makePermalinkWithString } from '../libs/string-utilities'

const router = express.Router()
const apiUrl = process.env.API_URL

/* GET home page. */
router.get('/', (req, res, next) => {
  const pageTitle = 'Billing'
  const options = {
    title: `${constants.PRODUCT_NAME} – ${pageTitle}`,
    permalink: makePermalinkWithString(pageTitle),
    css: req.app.locals.bundles.billing.css,
    js: req.app.locals.bundles.billing.js,
    apiUrl: apiUrl
  }
  res.render('billing', options)
})

export default router
