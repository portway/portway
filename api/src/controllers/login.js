import auth from '../libs/auth/auth'
import tokenIntegrator from '../integrators/token'
import passwordResetCoordinator from '../coordinators/passwordReset'

// Caution: login controller routes have NO AUTH by default!

const loginController = function(router) {
  router.post('/', auth.loginMiddleware, login)
  router.post('/resetpassword', resetPassword)
}

const login = function(req, res) {
  const token = tokenIntegrator.generateToken(req.user.id, req.user.orgRoleId, req.user.orgId)
  res.json({
    token
  })
}

const resetPassword = function(req, res) {
  const { email } = req.body

  passwordResetCoordinator.initiatePasswordReset(email)

  res.status(204).send()
}

export default loginController
