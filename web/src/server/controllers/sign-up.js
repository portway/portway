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

// @todo Hey @jj, how can I get this to render the form again
// and making sure organization and the radio buttons are whatever
// value they put in before?
// Will want to do that on the try/catch too I assume?
// Test by making the submit button enabled
const setInitialPassword = async (req, res) => {
  const {
    organization,
    password,
    'confirm-password': confirmPassword,
    'project-creation': projectCreation,
    token
  } = req.body

  if (password !== confirmPassword) {
    res.render('/sign-up/registration/complete?message=password', {
      orgName: organization,
      projectCreation: projectCreation
    })
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
