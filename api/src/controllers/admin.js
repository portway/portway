// Caution: admin controller routes have NO AUTH by default!
import adminAuth from '../libs/auth/adminAuth'
import demoSignupCoordinator from '../coordinators/demoSignup'
// import { validateBody } from '../libs/middleware/payloadValidation'
// import { requiredFields } from './payloadSchemas/helpers'
// import RESOURCE_TYPES from '../constants/resourceTypes'

const adminController = function(router) {
  // TODO: change to POST
  // TODO: validate? Or don't validate?
  router.post('/demoAccount',
    adminAuth,
    //validateBody(requiredFields(RESOURCE_TYPES.USER, 'name', 'email'), { includeDetails: true }),
    createAccount
  )
}

const createAccount = async function(req, res, next) {
  // users: [{ name: 'Bob', email: 'bob@bobalicious.com', role: ORGANIZATION_ROLE_IDS }, ...]
  // name: 'Org Name'
  const { name, users } = req.body

  try {
    await demoSignupCoordinator.createUsersAndOrganization(name, users)
    res.json({ success: true })
  } catch (e) {
    next(e)
  }
}

export default adminController
