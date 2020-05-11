import {
  MAX_COOKIE_AGE_MS,
  PATH_APP,
  PATH_PROJECTS,
  SUPPORT_LINK,
  URL_PRIVACY,
  URL_TERMS,
  URL_WEBSITE
} from '../../shared/constants'

import { renderBundles } from '../libs/express-utilities'
import auth from '../libs/auth'

const footerLinks = {
  privacyLink: URL_PRIVACY,
  supportLink: SUPPORT_LINK,
  termsLink: URL_TERMS,
  websiteLink: URL_WEBSITE,
}

const SignInController = function(router) {
  router.get('/', (req, res) => {
    if (req._portway.loggedIn) {
      res.redirect(`${PATH_APP}${PATH_PROJECTS}`)
    } else {
      res.render('index', {
        ...renderBundles(req, 'Sign in', 'index', { ...footerLinks, url: req.query.url })
      })
    }
  })

  router.post('/', auth.loginMiddleware, (req, res) => {
    res.cookie('token', req.user.token, { maxAge: MAX_COOKIE_AGE_MS })
    const route = req.body.url ? decodeURIComponent(req.body.url) : PATH_PROJECTS
    res.redirect(`${PATH_APP}${route}`)
  })
}

export default SignInController
