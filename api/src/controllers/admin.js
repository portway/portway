// Caution: admin controller routes have NO AUTH by default! And no middleware outside of
// catchall mounted middleware.
//
// This controller is directly loaded by the app, bypassing the controller loader
import bodyParser from 'body-parser'
import adminAuth from '../libs/auth/adminAuth'
import demoSignupCoordinator from '../coordinators/demoSignup'
import BusinessOrganization from '../businesstime/organization'
import organizationCoordinator from '../coordinators/organization'
import billingCoordinator from '../coordinators/billing'

const adminController = function(router) {
  /**
   * Sample Payload
   *
  Headers:
  "Authorization": "Admin [Admin key]"

  Body:
  {
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
  router.post('/demoAccount',
    bodyParser.json(),
    adminAuth,
    createAccount
  )

  router.get('/organizations', adminAuth, getOrganizations)

  router.post('/organizations/:id/updateBillingStatus', adminAuth, updateOrgBillingStatus)

  router.delete('/organizations/:id',
    adminAuth,
    deleteCanceledOrg
  )

  router.get('/organizations/canceled',
    adminAuth,
    getCanceledOrgs
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

const getOrganizations = async function(req, res, next) {
  try {
    const orgs = await BusinessOrganization.findAll()
    res.json({data: orgs})
  } catch (e) {
    next(e)
  }
}

const updateOrgBillingStatus = async function(req, res, next) {
  try {
    await billingCoordinator.fetchCustomerAndSetSubscriptionDataOnOrg(req.params.id)
    res.status(200).send()
  } catch(e) {
    next(e)
  }
}

const getCanceledOrgs = async function(req, res, next) {
  try {
    const canceledOrgs = await BusinessOrganization.findAllCanceled()
    res.json({ data: canceledOrgs })
  } catch (e) {
    next(e)
  }
}

const deleteCanceledOrg = async function(req, res, next) {
  const { id } = req.params

  try {
    await organizationCoordinator.deleteCanceledOrg(id)
    res.status(204).send()
  } catch (e) {
    next(e)
  }
}

export default adminController
