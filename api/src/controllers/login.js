import auth from '../libs/auth'
import tokenIntegrator from '../integrators/token'

// Caution: login controller routes have NO AUTH by default!

const loginController = function(router) {
  router.post('/', auth.loginMiddleware, login)
}

const login = function(req, res) {
  const token = tokenIntegrator.generateToken(req.user.id, req.user.orgRoleId, req.user.orgId)
  res.json({
    token
  })
}

export default loginController
