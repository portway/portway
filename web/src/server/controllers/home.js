import { renderBundles } from '../libs/express-utilities'
import { SIGNUP_DISABLED } from '../constants'
import { PATH_APP, PATH_PROJECTS, SUPPORT_LINK } from '../../shared/constants'

const HomeController = function(router) {
  /* GET home page. */
  router.get('/', (req, res) => {
    if (req._portway.loggedIn) {
      res.redirect(`${PATH_APP}${PATH_PROJECTS}`)
    } else {
      const options = {
        ...renderBundles(req, 'Home', 'index', { supportLink: SUPPORT_LINK }),
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
