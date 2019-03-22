import { renderBundles } from '../libs/express-utilities'
import auth from '../libs/auth'

import DangerAPI from './api'

const API = new DangerAPI(process.env.API_URL)

const SignUpController = function(router) {
  router.get('/processing', auth.jwtMiddleware, (req, res) => {
    res.render('user/processing', renderBundles(req, 'Processing', 'index'))
  })

  router.get('/registration/:token', auth.jwtMiddleware, (req, res) => {
    const { token } = req.query
    res.render(
      'user/registration',
      { ...renderBundles(req, 'Registration', 'index'), token })
  })

  router.post('/registration', auth.jwtMiddleware, (req, res) => {
    const { password, 'confirm-password': confirmPassword, token } = req.body

    // TODO re render form with mismatch error message
    if (password !== confirmPassword) {
      return res.send(400)
    }

    API.send({
      url: 'users/resetPassword',
      method: 'POST',
      data: {
        password,
        token
      }
    })
  })
}

export default SignUpController
