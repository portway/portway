import { renderBundles } from '../libs/express-utilities'
import DangerAPI from '../libs/api'

const API = new DangerAPI(process.env.API_URL)

const SignUpController = function(router) {
  router.get('/processing', (req, res) => {
    res.render('user/processing', renderBundles(req, 'Processing', 'index'))
  })

  router.post('/registration', registerOrganization)

  router.get('/registration/password', async (req, res) => {
    const { token } = req.query
    res.render('user/registration', { ...renderBundles(req, 'Registration', 'index'), token })
  })

  router.post('/registration/password', setInitialPassword)
}

const registerOrganization = async (req, res) => {
  const { name, email } = req.body

  let token
  try {
    ({ data: { token } } = await API.send({
      url: 'signup',
      method: 'POST',
      data: {
        name,
        email
      }
    }))
  } catch ({ response }) {
    console.error({ status: response.status, message: response.data })
    return res.status(500).send('There was an error registering your organization')
  }

  res.redirect(`registration/password?token=${token}`)
}

const setInitialPassword = async (req, res) => {
  const { password, 'confirm-password': confirmPassword, token } = req.body

  // TODO re-render form with mismatch error message
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
}

export default SignUpController
