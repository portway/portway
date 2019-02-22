import express from 'express'

import { renderBundles } from '../libs/express-utilities'
import auth from '../libs/auth'

const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', renderBundles(req, 'Home', 'index'))
})

router.get('/sign-up', (req, res) => {
  res.render('user/sign-up', renderBundles(req, 'Sign up', 'index'))
})

router.get('/sign-in', (req, res) => {
  res.render('user/sign-in', renderBundles(req, 'Sign in', 'index'))
})

router.post('/sign-in', auth.loginMiddleware, (req, res) => {
  res.json(req.user)
})

router.get('/sign-in/password-reset', (req, res) => {
  res.render('user/password-reset', renderBundles(req, 'Reset password', 'index'))
})

export default router
