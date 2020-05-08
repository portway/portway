import { renderBundles } from '../libs/express-utilities'
import { SIGNUP_DISABLED } from '../constants'

import {
  PATH_APP,
  PATH_PROJECTS,
  SUPPORT_LINK,
  URL_PRIVACY,
  URL_TERMS,
  URL_WEBSITE
} from '../../shared/constants'

const footerLinks = {
  privacyLink: URL_PRIVACY,
  supportLink: SUPPORT_LINK,
  termsLink: URL_TERMS,
  websiteLink: URL_WEBSITE,
}

const HomeController = function(router) {
  /* GET home page. */
  router.get('/', (req, res) => {
    if (req._portway.loggedIn) {
      res.redirect(`${PATH_APP}${PATH_PROJECTS}`)
    } else {
      const options = {
        ...renderBundles(req, 'Home', 'index', footerLinks),
        disableSignup: SIGNUP_DISABLED,
        flash: req.query.resetLinkSent === 'true' ? {
          type: 'info',
          message: 'Check your email for a password reset link'
        } : null
      }
      res.render('index', options)
    }
  })
}

export default HomeController
