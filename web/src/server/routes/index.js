import express from 'express'
import constants from '../../shared/constants'
import { makePermalinkWithString } from '../libs/string-utilities'
import auth from '../libs/auth'

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
router.get('/', (req, res) => {
  res.render('index', renderBundles(req, 'Home'))
})

router.get('/sign-up', (req, res) => {
  res.render('user/sign-up', renderBundles(req, 'Sign up'))
})

router.get('/sign-in', (req, res) => {
  res.render('user/sign-in', renderBundles(req, 'Sign in'))
})

router.post('/sign-in', auth.loginMiddleware, (req, res) => {
  res.json(req.user)
})

router.get('/sign-in/password-reset', (req, res) => {
  res.render(
    'user/password-reset',
    renderBundles(req, 'Reset password')
  )
})

export default router
