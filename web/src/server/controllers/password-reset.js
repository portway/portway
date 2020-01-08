import { renderBundles } from '../libs/express-utilities'
import DangerAPI from '../libs/api'
import { MAX_COOKIE_AGE_MS, PATH_APP, PATH_PROJECTS, SUPPORT_LINK } from '../../shared/constants'

const API = new DangerAPI(process.env.API_URL)

const PasswordResetController = function(router) {
  router.get('/', (req, res) => {
    res.render(
      'user/password-reset',
      renderBundles(req, 'Reset password', 'index', { supportLink: SUPPORT_LINK })
    )
  })

  router.get('/complete', (req, res) => {
    const { token } = req.query
    res.render('user/complete-password-reset', {
      ...renderBundles(req, 'Reset Password', 'passwordReset', { supportLink: SUPPORT_LINK }),
      token
    })
  })

  router.post('/complete', setNewPassword)

  router.get('/processing', (req, res) => {
    res.send('processing, please check your email')
  })

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

  res.redirect('/password-reset/processing')
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
      ...renderBundles(req, 'Reset Password', 'passwordReset', { supportLink: SUPPORT_LINK }),
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
      ...renderBundles(req, 'Reset Password', 'passwordReset', { supportLink: SUPPORT_LINK }),
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
