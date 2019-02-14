import express from 'express'
import constants from '../../shared/constants'
import { makePermalinkWithString } from '../libs/string-utilities'

const router = express.Router()

const renderBundles = (req, pageTitle) => {
  return {
    title: `${constants.PRODUCT_NAME} – ${pageTitle}`,
    permalink: makePermalinkWithString(pageTitle),
    css: req.app.locals.bundles.dashboard.css,
    vendor: req.app.locals.bundles.vendor.js,
    js: req.app.locals.bundles.dashboard.js
  }
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('dashboard/index', renderBundles(req, 'Welcome'))
})

export default router
