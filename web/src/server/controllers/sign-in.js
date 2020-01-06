import { MAX_COOKIE_AGE_MS, PATH_APP, PATH_PROJECTS, SUPPORT_LINK } from '../../shared/constants'

import { renderBundles } from '../libs/express-utilities'
import auth from '../libs/auth'
import DangerAPI from '../libs/api'

const API = new DangerAPI(process.env.API_URL)

const SignInController = function(router) {
  router.get('/', (req, res) => {
    if (req._portway.loggedIn) {
      res.redirect(`${PATH_APP}${PATH_PROJECTS}`)
    } else {
      res.render('index', { ...renderBundles(req, 'Sign in', 'index', { supportLink: SUPPORT_LINK }), url: req.query.url })
    }
  })

  router.get('/password-reset', (req, res) => {
    res.render('user/password-reset', renderBundles(req, 'Reset password', 'index', { supportLink: SUPPORT_LINK }))
  })

  router.post('/password-reset', resetPassword)

  router.post('/', auth.loginMiddleware, (req, res) => {
    res.cookie('token', req.user.token, { maxAge: MAX_COOKIE_AGE_MS })
    const route = req.body.url ? decodeURIComponent(req.body.url) : PATH_PROJECTS
    res.redirect(`${PATH_APP}${route}`)
  })
}

const resetPassword = async (req, res) => {
  const { email } = req.body

  try {
    await API.send({
      url: 'v1/reset-password',
      method: 'POST',
      data: {
        email
      }
    })
  } catch ({ response }) {
    if (!response) {
      console.error('Timeout error')
    } else {
      console.error({ status: response.status, message: response.data })
    }
  }

  res.redirect('/sign-up/password-reset/processing')
}

export default SignInController
