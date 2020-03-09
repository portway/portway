import { renderBundles } from '../libs/express-utilities'
import DangerAPI from '../libs/api'
import { MAX_COOKIE_AGE_MS, PATH_APP, PATH_PROJECTS, SUPPORT_LINK } from '../../shared/constants'
import { SIGNUP_DISABLED } from '../constants'

const API = new DangerAPI(process.env.API_URL)

const SignUpController = function(router) {
  router.get('/', (req, res) => {
    res.render('user/sign-up', renderBundles(req, 'Sign up', 'index', { supportLink: SUPPORT_LINK }))
  })

  router.get('/processing', (req, res) => {
    res.render('user/processing', renderBundles(req, 'Processing', 'index', { supportLink: SUPPORT_LINK }))
  })

  router.post('/registration', registerOrganization)

  router.get('/registration/complete', async (req, res) => {
    const { token } = req.query
    res.render('user/registration', { ...renderBundles(req, 'Registration', 'registration', { supportLink: SUPPORT_LINK }), token })
  })

  router.post('/registration/complete', setInitialPassword)
}

const registerOrganization = async (req, res) => {
  if (SIGNUP_DISABLED) {
    return res.status(403).send('Signup disabled')
  }

  const { name, email } = req.body

  try {
    await API.send({
      url: 'v1/signup',
      method: 'POST',
      data: {
        name,
        email
      }
    })
  } catch ({ response }) {
    if (!response) {
      console.error('Timeout error')
    } else {
      console.error({ status: response.status, message: response.data })
    }

    if (response.status === 409) {
      res.status(409)
      return res.render('user/sign-up', {
        ...renderBundles(req, 'Sign up', 'index', { supportLink: SUPPORT_LINK }),
        flash: {
          type: 'error',
          message: 'There is already a user with this email address'
        },
      })
    }

    res.status(500)
    return res.render('user/sign-up', {
      ...renderBundles(req, 'Sign up', 'index', { supportLink: SUPPORT_LINK }),
      flash: {
        type: 'error',
        message: 'There was an error registering your organization'
      },
    })
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
      ...renderBundles(req, 'Registration', 'registration', { supportLink: SUPPORT_LINK }),
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
      url: 'v1/signup/initialPassword',
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`
      },
      data: {
        password
      }
    }))
  } catch ({ response }) {
    return res.render('user/registration', {
      ...renderBundles(req, 'Registration', 'registration', { supportLink: SUPPORT_LINK }),
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

export default SignUpController
