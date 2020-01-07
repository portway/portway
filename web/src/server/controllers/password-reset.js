import { renderBundles } from '../libs/express-utilities'
import DangerAPI from '../libs/api'
import { SUPPORT_LINK } from '../../shared/constants'

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
    res.render('user/registration', {
      ...renderBundles(req, 'Registration', 'registration', { supportLink: SUPPORT_LINK }),
      token
    })
  })

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

export default PasswordResetController
