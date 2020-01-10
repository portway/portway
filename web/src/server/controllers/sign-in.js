import { MAX_COOKIE_AGE_MS, PATH_APP, PATH_PROJECTS, SUPPORT_LINK } from '../../shared/constants'

import { renderBundles } from '../libs/express-utilities'
import auth from '../libs/auth'

const SignInController = function(router) {
  router.get('/', (req, res) => {
    if (req._portway.loggedIn) {
      res.redirect(`${PATH_APP}${PATH_PROJECTS}`)
    } else {
      res.render('index', { ...renderBundles(req, 'Sign in', 'index', { supportLink: SUPPORT_LINK }), url: req.query.url })
    }
  })

  router.post('/', auth.loginMiddleware, (req, res) => {
    res.cookie('token', req.user.token, { maxAge: MAX_COOKIE_AGE_MS })
    const route = req.body.url ? decodeURIComponent(req.body.url) : PATH_PROJECTS
    res.redirect(`${PATH_APP}${route}`)
  })
}

export default SignInController
