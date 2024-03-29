import { renderBundles } from '../libs/express-utilities'
import DangerAPI from '../libs/api'
import {
  MAX_COOKIE_AGE_MS,
  PATH_APP,
  PATH_PROJECTS,
  SUPPORT_LINK,
  URL_PRIVACY,
  URL_TERMS,
  URL_WEBSITE
} from '../../shared/constants'

const API = new DangerAPI(process.env.API_URL)

const footerLinks = {
  privacyLink: URL_PRIVACY,
  supportLink: SUPPORT_LINK,
  termsLink: URL_TERMS,
  websiteLink: URL_WEBSITE,
}

const PasswordResetController = function(router) {
  router.get('/', (req, res) => {
    res.render(
      'user/password-reset',
      renderBundles(req, 'Reset password', 'index', footerLinks)
    )
  })

  router.get('/complete', (req, res) => {
    const { token } = req.query
    res.render('user/complete-password-reset', {
      ...renderBundles(req, 'Reset Password', 'passwordReset', footerLinks),
      token
    })
  })

  router.post('/complete', setNewPassword)

  router.post('/', resetPassword)
}

const resetPassword = async (req, res) => {
  const { email } = req.body

  try {
    await API.send({
      url: 'v1/login/resetpassword',
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

  res.redirect('/?resetLinkSent=true')
}

const setNewPassword = async (req, res) => {
  const {
    orgName,
    password,
    'confirm-password': confirmPassword,
    'project-creation': projectCreation,
    token
  } = req.body

  if (password !== confirmPassword) {
    return res.render('user/complete-password-reset', {
      ...renderBundles(req, 'Reset Password', 'passwordReset', footerLinks),
      token,
      flash: {
        type: 'error',
        message: 'The passwords you entered do not match'
      },
      orgName,
      projectCreation
    })
  }

  let accessToken
  try {
    ({ data: { token: accessToken } } = await API.send({
      url: 'v1/login/newpassword',
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`
      },
      data: {
        password
      }
    }))
  } catch ({ response }) {
    return res.render('user/complete-password-reset', {
      ...renderBundles(req, 'Reset Password', 'passwordReset', footerLinks),
      token,
      flash: {
        type: 'error',
        message: 'Cannot set password, this link has expired'
      },
      orgName,
      projectCreation
    })
  }
  res.cookie('token', accessToken, { maxAge: MAX_COOKIE_AGE_MS })
  res.redirect(`${PATH_APP}${PATH_PROJECTS}`)
}

export default PasswordResetController
