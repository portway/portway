import { renderBundles } from '../libs/express-utilities'
import DangerAPI from '../libs/api'

const API = new DangerAPI(process.env.API_URL)

const SignUpController = function(router) {
  router.get('/processing', (req, res) => {
    res.render('user/processing', renderBundles(req, 'Processing', 'index'))
  })

  router.post('/registration', registerOrganization)

  router.get('/registration/complete', async (req, res) => {
    const { token } = req.query
    res.render('user/registration', { ...renderBundles(req, 'Registration', 'registration'), token })
  })

  router.post('/registration/complete', setInitialPassword)
}

const registerOrganization = async (req, res) => {
  const { name, email } = req.body

  try {
    await API.send({
      url: 'signup',
      method: 'POST',
      data: {
        name,
        email
      }
    })
  } catch ({ response }) {
    console.error({ status: response.status, message: response.data })
    return res.status(500).send('There was an error registering your organization')
  }

  res.redirect('/sign-up/processing')
}

const setInitialPassword = async (req, res) => {
  const {
    orgName,
    password,
    'confirm-password': confirmPassword,
    'project-creation': projectCreation,
    token
  } = req.body

  if (password !== confirmPassword) {
    return res.render('user/registration', {
      ...renderBundles(req, 'Registration', 'registration'),
      token,
      flash: {
        type: 'error',
        message: 'The passwords you entered do not match'
      },
      orgName,
      projectCreation
    })
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
    return res.render('user/registration', {
      ...renderBundles(req, 'Registration', 'registration'),
      token,
      flash: {
        type: 'error',
        message: response.data.error
      },
      orgName,
      projectCreation
    })
  }

  res.redirect('/sign-in')
}

export default SignUpController
