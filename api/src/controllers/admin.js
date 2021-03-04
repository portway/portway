// Caution: admin controller routes have NO AUTH by default! And no middleware outside of
// catchall mounted middleware.
//
// This controller is directly loaded by the app, bypassing the controller loader
import bodyParser from 'body-parser'
import adminAuth from '../libs/auth/adminAuth'
import demoSignupCoordinator from '../coordinators/demoSignup'
import BusinessOrganization from '../businesstime/organization'
import BusinessUser from '../businesstime/user'
import BusinessWebhookDelivery from '../businesstime/webhookDelivery'
import organizationCoordinator from '../coordinators/organization'
import billingCoordinator from '../coordinators/billing'
import { deleteSoftDeletedResources } from '../coordinators/resources'
import adminImageFieldFormatsSchema from './payloadSchemas/adminImageFieldFormats'
import { validateBody } from '../libs/middleware/payloadValidation'
import BusinessField from '../businesstime/field'

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

  router.get('/webhookdeliveries',
    adminAuth,
    getWebhookDeliveries
  )

  router.delete('/webhookdeliveries/:id',
    adminAuth,
    deleteWebhookDelivery
  )

  router.delete('/unverifiedOrgs',
    adminAuth,
    deleteUnverifiedOrgs
  )

  router.delete('/softdeletedresources',
    adminAuth,
    deleteStaleResources
  )

  router.put('/organizations/:orgId/documents/:documentId/fields/:id/formats',
    bodyParser.json(),
    validateBody(adminImageFieldFormatsSchema, { includeDetails: true }),
    adminAuth,
    updateImageFieldFormats
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
  } catch (e) {
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

const getWebhookDeliveries = async function(req, res, next) {
  const { page = 1, perPage = 50 } = req.query

  try {
    const result = await BusinessWebhookDelivery.findAllOlderThanThirtyDays({ page, perPage })

    res.json({
      data: result.webhookDeliveries,
      page,
      perPage,
      total: result.count,
      totalPages: Math.ceil(result.count / perPage)
    })
  } catch (e) {
    next(e)
  }
}

const deleteWebhookDelivery = async function(req, res, next) {
  try {
    await BusinessWebhookDelivery.deleteById(req.params.id)
    res.status(204).send()
  } catch (e) {
    next(e)
  }
}

const deleteUnverifiedOrgs = async function(req, res, next) {
  try {
    const unverifiedUsers = await BusinessUser.findAllUnverifiedOwners()
    let removedOrgsCount = 0
    for (const user of unverifiedUsers) {
      await organizationCoordinator.removeAllOrgData(user.orgId)
      removedOrgsCount += 1
    }
    res.status(200).send({ data: { removedOrgsCount } })
  } catch (e) {
    next(e)
  }
}

const deleteStaleResources = async function(req, res, next) {
  try {
    await deleteSoftDeletedResources()
    res.status(204).send()
  } catch (e) {
    next(e)
  }
}

const updateImageFieldFormats = async function(req, res, next) {
  const { id, documentId, orgId } = req.params
  const { body } = req

  try {
    const field = await BusinessField.updateByIdForDocument(id, documentId, orgId, { formats: body })
    res.status(200).json({ data: field })
  } catch (e) {
    next(e)
  }
}

export default adminController
