import { renderBundles } from '../libs/express-utilities'
import auth from '../libs/auth'

import DangerAPI from '../libs/api'

const API = new DangerAPI(process.env.API_URL)

const SignUpController = function(router) {
  router.get('/processing', auth.jwtMiddleware, (req, res) => {
    res.render('user/processing', renderBundles(req, 'Processing', 'index'))
  })

  router.post('/registration', auth.jwtMiddleware, async (req, res) => {
    const { firstName, lastName, email } = req.body

    let token
    try {
      ({ data: { token } } = await API.send({
        url: 'signup',
        method: 'POST',
        data: {
          firstName,
          lastName,
          email
        }
      }))
    } catch ({ response }) {
      console.error({ status: response.status, message: response.data })
      return res.status(500).send('There was an error registering your organization')
    }

    res.redirect(`registration/password?token=${token}`)
  })

  router.get('/registration/password', auth.jwtMiddleware, async (req, res) => {
    const { token } = req.query

    res.render('user/registration', { ...renderBundles(req, 'Registration', 'index'), token })
  })

  router.post('/registration/password', auth.jwtMiddleware, async (req, res) => {
    const { password, 'confirm-password': confirmPassword, token } = req.body

    // TODO re render form with mismatch error message
    if (password !== confirmPassword) {
      return res.send(400)
    }

    try {
      await API.send({
        url: 'signup/initialPassword',
        method: 'POST',
        headers: {
          Authorization: `bearer ${token}`
        },
        data: {
          password
        }
      })
    } catch ({ response }) {
      console.error({ status: response.status, message: response.data })
      return res.status(500).send('There was an error setting your password')
    }

    res.redirect('/sign-in')
  })
}

export default SignUpController
