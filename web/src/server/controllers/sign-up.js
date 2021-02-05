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
import { SIGNUP_DISABLED } from '../constants'

const API = new DangerAPI(process.env.API_URL)

const footerLinks = {
  privacyLink: URL_PRIVACY,
  supportLink: SUPPORT_LINK,
  termsLink: URL_TERMS,
  websiteLink: URL_WEBSITE,
}

const SignUpController = function(router) {
  // Initial sign up form. Posts to /registration route and then redirects to /processing
  router.get('/', (req, res) => {
    const { source } = req.query
    res.render('user/sign-up', { ...renderBundles(req, 'Sign up', 'signup', footerLinks), source })
  })

  // After initial signup, this route renders "Verify email address" static page
  router.get('/processing', (req, res) => {
    res.render('user/processing', renderBundles(req, 'Processing', 'index', footerLinks))
  })

  // This is the initial signup route, when a user first submits their name and email to create
  // a Portway account
  router.post('/registration', registerOrganization)

  // This is the page rendered for the user to set their initial password _after_ they have verified
  // their email
  router.get('/registration/complete', async (req, res) => {
    const { token } = req.query
    res.render('user/registration', { ...renderBundles(req, 'Registration', 'registration', footerLinks), token })
  })

  // Set initial password form submission
  router.post('/registration/complete', completeRegistration)
}

const registerOrganization = async (req, res) => {
  if (SIGNUP_DISABLED) {
    return res.status(403).send('Signup disabled')
  }

  const { name, email, source } = req.body

  try {
    await API.send({
      url: 'v1/signup',
      method: 'POST',
      data: {
        name,
        email,
        source
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
        ...renderBundles(req, 'Sign up', 'signup', footerLinks),
        flash: {
          type: 'error',
          message: 'There is already a user with this email address'
        },
      })
    }

    res.status(500)
    return res.render('user/sign-up', {
      ...renderBundles(req, 'Sign up', 'signup', footerLinks),
      flash: {
        type: 'error',
        message: 'There was an error registering your organization'
      },
    })
  }

  res.redirect('/sign-up/processing')
}

const completeRegistration = async (req, res) => {
  const {
    orgName,
    password,
    'confirm-password': confirmPassword,
    'project-creation': projectCreation,
    token,
    mailchimp
  } = req.body

  if (password !== confirmPassword) {
    return res.render('user/registration', {
      ...renderBundles(req, 'Registration', 'registration', footerLinks),
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
        password,
        joinNewsletter: mailchimp === 'on'
      }
    }))
  } catch ({ response }) {
    return res.render('user/registration', {
      ...renderBundles(req, 'Registration', 'registration', footerLinks),
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
