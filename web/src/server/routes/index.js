import express from 'express'
import constants from '../../shared/constants'
import { makePermalinkWithString } from '../libs/string-utilities'

const router = express.Router()

const renderBundles = (req, pageTitle) => {
  return {
    title: `${constants.PRODUCT_NAME} – ${pageTitle}`,
    permalink: makePermalinkWithString(pageTitle),
    css: req.app.locals.bundles.index.css,
    vendor: req.app.locals.bundles.vendor.js,
    js: req.app.locals.bundles.index.js
  }
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', renderBundles(req, 'Home'))
})

router.get('/sign-up', (req, res, next) => {
  res.render('user/sign-up', renderBundles(req, 'Sign up'))
})

router.get('/sign-in', (req, res, next) => {
  res.render('user/sign-in', renderBundles(req, 'Sign in'))
})

router.get('/sign-in/password-reset', (req, res, next) => {
  res.render(
    'user/password-reset',
    renderBundles(req, 'Reset password')
  )
})

export default router
