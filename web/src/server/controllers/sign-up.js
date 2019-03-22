import { renderBundles } from '../libs/express-utilities'
import auth from '../libs/auth'

const SignUpController = function(router) {
  router.get('/processing', auth.jwtMiddleware, (req, res) => {
    res.render('user/processing', renderBundles(req, 'Processing', 'index'))
  })

  router.get('/registration', auth.jwtMiddleware, (req, res) => {
    res.render('user/registration', renderBundles(req, 'Registration', 'index'))
  })
}

export default SignUpController
