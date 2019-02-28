import constants from '../../shared/constants'

import { renderBundles } from '../libs/express-utilities'
import auth from '../libs/auth'

const UsersController = function(router) {
  router.get('/sign-up', (req, res) => {
    res.render('user/sign-up', renderBundles(req, 'Sign up', 'index'))
  })

  router.get('/sign-in', (req, res) => {
    console.info('users controller sign-in')
    res.render('user/sign-in', renderBundles(req, 'Sign in', 'index'))
  })

  router.post('/sign-in', auth.loginMiddleware, (req, res) => {
    res.cookie('token', req.user.token, { maxAge: constants.MAX_COOKIE_AGE_MS })
    res.redirect('/d/dashboard')
  })

  router.get('/sign-in/password-reset', auth.jwtMiddleware, (req, res) => {
    res.render('user/password-reset', renderBundles(req, 'Reset password', 'index'))
  })
}

export default UsersController
