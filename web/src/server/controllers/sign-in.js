import { MAX_COOKIE_AGE_MS, PATH_APP, PATH_PROJECTS } from '../../shared/constants'

import { renderBundles } from '../libs/express-utilities'
import auth from '../libs/auth'

const SignInController = function(router) {
  router.get('/', (req, res) => {
    console.info('users controller sign-in')
    res.render('user/sign-in', renderBundles(req, 'Sign in', 'index'))
  })

  router.post('/', auth.loginMiddleware, (req, res) => {
    res.cookie('token', req.user.token, { maxAge: MAX_COOKIE_AGE_MS })
    res.redirect(`${PATH_APP}${PATH_PROJECTS}`)
  })

  router.get('/password-reset', auth.jwtMiddleware, (req, res) => {
    res.render('user/password-reset', renderBundles(req, 'Reset password', 'index'))
  })
}

export default SignInController
