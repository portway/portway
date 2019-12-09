// Caution: admin controller routes have NO AUTH by default! And no middleware outside of
// catchall mounted middleware.
//
// This controller is directly loaded by the app, bypassing the controller loader
import bodyParser from 'body-parser'
import adminAuth from '../libs/auth/adminAuth'
import demoSignupCoordinator from '../coordinators/demoSignup'

/**
 * Sample Payload
 *
{
  "adminKey": "****",
  "name": "Org Name",
  "users": [
    {
      "name": "BobbyBong 1",
      "email": "example1@bonkeybong.com",
      "role": 1
    }
  ]
}
*/

const adminController = function(router) {
  router.post('/demoAccount',
    bodyParser.json(),
    adminAuth,
    createAccount
  )
}

const createAccount = async function(req, res, next) {
  const { name, users } = req.body

  try {
    await demoSignupCoordinator.createUsersAndOrganization(name, users)
    res.json({ success: true })
  } catch (e) {
    next(e)
  }
}

export default adminController
