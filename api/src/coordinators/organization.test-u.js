import BusinessOrganization from '../businesstime/organization'
import stripeIntegrator from '../integrators/stripe'
import organizationCoordinator from '../coordinators/organization'

jest.mock('../businesstime/organization')
jest.mock('../integrators/stripe')

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
})