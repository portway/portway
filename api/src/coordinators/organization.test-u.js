import BusinessOrganization from '../businesstime/organization'
import BusinessField from '../businesstime/field'
import BusinessDocumentVersion from '../businesstime/documentversion'
import BusinessDocument from '../businesstime/document'
import BusinessProject from '../businesstime/project'
import BusinessProjectToken from '../businesstime/projecttoken'
import BusinessUser from '../businesstime/user'
import BusinessProjectUser from '../businesstime/projectuser'
import BusinessResourceUsage from '../businesstime/resourceusage'
import stripeIntegrator from '../integrators/stripe'
import { deleteOrgDirectory } from '../integrators/s3'
import organizationCoordinator from '../coordinators/organization'

jest.mock('../businesstime/organization')
jest.mock('../businesstime/field')
jest.mock('../businesstime/documentversion')
jest.mock('../businesstime/document')
jest.mock('../businesstime/project')
jest.mock('../businesstime/projecttoken')
jest.mock('../businesstime/user')
jest.mock('../businesstime/projectuser')
jest.mock('../businesstime/resourceusage')
jest.mock('../integrators/stripe')
jest.mock('../integrators/s3')
// separate these internally used functions from the mock object so we can use them for their unit tests
const removeAllOrgData = organizationCoordinator.removeAllOrgData
organizationCoordinator.removeAllOrgData = jest.fn()

describe('organization coordinator', () => {
  const orgId = 9876
  const oldName = 'old-name'
  const body = { name: 'not-a-real-new-org-name' }
  const stripeId = 'not-a-real-stripe-test-id'

  beforeAll(async () => {
    BusinessOrganization.findById.mockReturnValueOnce({ name: oldName, stripeId })
    stripeIntegrator.getCustomer.mockReturnValueOnce({ id: stripeId })
    organizationCoordinator.updateById(orgId, body)
  })

  describe('#updateById', () => {
    describe('when the org name is changing', () => {
      it('should call BusinessOrganization.findById with the passed in id', () => {
        expect(BusinessOrganization.findById.mock.calls.length).toBe(1)
        expect(BusinessOrganization.findById.mock.calls[0][0]).toBe(orgId)
      })

      it('should call stripeIntegrator.getCustomer with the retrieved org stripeId', () => {
        expect(stripeIntegrator.getCustomer.mock.calls.length).toBe(1)
        expect(stripeIntegrator.getCustomer.mock.calls[0][0]).toBe(stripeId)
      })

      it('should call BusinessOrganization.updateById with the passed in org id and body', () => {
        expect(BusinessOrganization.updateById.mock.calls.length).toBe(1)
        expect(BusinessOrganization.updateById.mock.calls[0][0]).toBe(orgId)
        expect(BusinessOrganization.updateById.mock.calls[0][1]).toBe(body)
      })

      it('should call stripeIntegrator.updateCustomer with the org name change', () => {
        expect(stripeIntegrator.updateCustomer.mock.calls[0][0]).toBe(stripeId)
        expect(stripeIntegrator.updateCustomer.mock.calls[0][1]).toEqual(expect.objectContaining({ name: body.name }))
      })
    })

    describe('when the org name is not changing', () => {
      beforeAll(async () => {
        stripeIntegrator.updateCustomer.mockClear()
        BusinessOrganization.findById.mockReturnValueOnce({ name: oldName, stripeId })
        stripeIntegrator.getCustomer.mockReturnValueOnce({ id: stripeId })
        organizationCoordinator.updateById(orgId, { name: oldName })
      })

      it('should not call stripeIntegrator.updateCustomer', async () => {
        expect(stripeIntegrator.updateCustomer.mock.calls.length).toBe(0)
      })
    })
  })

  describe('#removeAllOrgData', () => {
    beforeAll(async () => {
      removeAllOrgData(orgId)
    })

    it('should call s3Integrator.deleteOrgDirectory', () => {
      expect(deleteOrgDirectory.mock.calls.length).toBe(1)
      expect(deleteOrgDirectory.mock.calls[0][0]).toBe(orgId)
    })

    it('should call BusinessField.deleteAllForOrg', () => {
      expect(BusinessField.deleteAllForOrg.mock.calls.length).toBe(1)
      expect(BusinessField.deleteAllForOrg.mock.calls[0][0]).toBe(orgId)
    })

    it('should call BusinessDocumentVersion.deleteAllForOrg', () => {
      expect(BusinessDocumentVersion.deleteAllForOrg.mock.calls.length).toBe(1)
      expect(BusinessDocumentVersion.deleteAllForOrg.mock.calls[0][0]).toBe(orgId)
    })

    it('should call BusinessDocument.deleteAllForOrg', () => {
      expect(BusinessDocument.deleteAllForOrg.mock.calls.length).toBe(1)
      expect(BusinessDocument.deleteAllForOrg.mock.calls[0][0]).toBe(orgId)
    })

    it('should call BusinessProject.deleteAllForOrg', () => {
      expect(BusinessProject.deleteAllForOrg.mock.calls.length).toBe(1)
      expect(BusinessProject.deleteAllForOrg.mock.calls[0][0]).toBe(orgId)
    })

    it('should call BusinessProjectToken.deleteAllForOrg', () => {
      expect(BusinessProjectToken.deleteAllForOrg.mock.calls.length).toBe(1)
      expect(BusinessProjectToken.deleteAllForOrg.mock.calls[0][0]).toBe(orgId)
    })

    it('should call BusinessUser.deleteAllForOrg', () => {
      expect(BusinessUser.deleteAllForOrg.mock.calls.length).toBe(1)
      expect(BusinessUser.deleteAllForOrg.mock.calls[0][0]).toBe(orgId)
    })

    it('should call BusinessProjectUser.deleteAllForOrg', () => {
      expect(BusinessProjectUser.deleteAllForOrg.mock.calls.length).toBe(1)
      expect(BusinessProjectUser.deleteAllForOrg.mock.calls[0][0]).toBe(orgId)
    })

    it('should call BusinessResourceUsage.deleteAllForOrg', () => {
      expect(BusinessResourceUsage.deleteAllForOrg.mock.calls.length).toBe(1)
      expect(BusinessResourceUsage.deleteAllForOrg.mock.calls[0][0]).toBe(orgId)
    })

    it('should call BusinessOrganization.deleteById', () => {
      expect(BusinessOrganization.deleteById.mock.calls.length).toBe(1)
      expect(BusinessOrganization.deleteById.mock.calls[0][0]).toBe(orgId)
    })
  })

  describe('#deleteCanceledOrg', () => {
    function isoDateDaysAgo(days) {
      const ms = 1000 * 60 * 60 * 24 * days
      const twentyDaysAgo = Date.now() - ms
      return new Date(twentyDaysAgo).toISOString()
    }

    beforeAll(async () => {
      BusinessOrganization.findById.mockReturnValueOnce({ id: orgId, canceledAt: isoDateDaysAgo(30) })
      await organizationCoordinator.deleteCanceledOrg(orgId)
    })

    it('should call organizationCoordinator.removeAllOrgData with the passed in org id', () => {
      expect(organizationCoordinator.removeAllOrgData.mock.calls.length).toBe(1)
      expect(organizationCoordinator.removeAllOrgData.mock.calls[0][0]).toBe(orgId)
    })

    describe('when the org has no canceledAt value', () => {
      it('should throw an error', async () => {
        await expect(organizationCoordinator.deleteCanceledOrg()).rejects
          .toThrow(expect.objectContaining({ code: 409 }))
      })
    })

    describe('when the org canceledAt value is less than 30 days ago', () => {
      it('should throw an error', async () => {
        BusinessOrganization.findById.mockReturnValueOnce({ id: orgId, canceledAt: isoDateDaysAgo(20) })
        await expect(organizationCoordinator.deleteCanceledOrg()).rejects
          .toThrow(expect.objectContaining({ code: 409 }))
      })
    })
  })
})