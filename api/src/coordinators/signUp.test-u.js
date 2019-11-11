import signUpCoordinator from './signUp'
import BusinessUser from '../businesstime/user'
import BusinessOrganization from '../businesstime/organization'
import tokenIntegrator from '../integrators/token'
import stripeIntegrator from '../integrators/stripe'
import passwordResetKey from '../libs/passwordResetKey'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'
import { sendSingleRecipientEmail } from '../integrators/email'
import { PLANS, TRIAL_PERIOD_DAYS } from '../constants/plans'
import billingCoordinator from './billing'

jest.mock('../businesstime/user')
jest.mock('../businesstime/organization')
jest.mock('../integrators/token')
jest.mock('../integrators/stripe')
jest.mock('../libs/passwordResetKey')
jest.mock('../integrators/email')
jest.mock('./billing')

describe('signUp coordinator', () => {
  const name = 'Nicolas Cage'
  const email = 'faceoff@johntravolta.gov'

  describe('#createUserAndOrganization', () => {
    beforeAll(async () => {
      BusinessOrganization.updateById.mockClear()
      await signUpCoordinator.createUserAndOrganization(
        name,
        email
      )
    })

    it('should call BusinessOrganization.create', () => {
      expect(BusinessOrganization.create.mock.calls.length).toBe(1)
    })

    it('should call passwordResetKey.generate', () => {
      expect(passwordResetKey.generate.mock.calls.length).toBe(1)
    })

    it('should call BusinessUser.create with the correct body', () => {
      const mockResetKey = passwordResetKey.generate.mock.results[0].value
      const mockOrgId = BusinessOrganization.create.mock.results[0].value.id
      expect(BusinessUser.create.mock.calls.length).toBe(1)
      expect(BusinessUser.create.mock.calls[0][0]).toEqual({
        name,
        email,
        orgId: mockOrgId,
        resetKey: mockResetKey,
        orgRoleId: ORGANIZATION_ROLE_IDS.OWNER
      })
    })

    it('should call stripeIntegrator.createCustomer with the org name and a description containing owner email', () => {
      const mockOrgName = BusinessOrganization.create.mock.results[0].value.name
      expect(stripeIntegrator.createCustomer.mock.calls.length).toBe(1)
      expect(stripeIntegrator.createCustomer.mock.calls[0][0]).toEqual({ name: mockOrgName, description: expect.stringMatching(email) })
    })

    it('should call billingCoordinator.createOrUpdateSubscription with the customer id, plan id, trial period, and orgId', () => {
      const customerId = stripeIntegrator.createCustomer.mock.results[0].value.id
      const mockOrgId = BusinessOrganization.create.mock.results[0].value.id
      expect(billingCoordinator.createOrUpdateOrgSubscription.mock.calls.length).toBe(1)
      expect(billingCoordinator.createOrUpdateOrgSubscription.mock.calls[0][0]).toEqual({
        customerId,
        planId: PLANS.SINGLE_USER,
        trialPeriodDays: TRIAL_PERIOD_DAYS,
        orgId: mockOrgId
      })
    })

    it('should call BusinessOrganization.updateById with the org id, owner id, stripe id', () => {
      const stripeId = stripeIntegrator.createCustomer.mock.results[0].value.id
      const mockOrgId = BusinessOrganization.create.mock.results[0].value.id
      const mockOwnerId = BusinessUser.create.mock.results[0].value.id
      expect(BusinessOrganization.updateById.mock.calls.length).toBe(1)
      expect(BusinessOrganization.updateById.mock.calls[0][0]).toEqual(mockOrgId)
      expect(BusinessOrganization.updateById.mock.calls[0][1]).toEqual({ ownerId: mockOwnerId, stripeId })
    })

    // eslint-disable-next-line max-len
    it('should call tokenIntegrator.generatePasswordResetToken with the user id and reset key', () => {
      const mockResetKey = passwordResetKey.generate.mock.results[0].value
      const mockUserId = BusinessUser.create.mock.results[0].value.id
      expect(tokenIntegrator.generatePasswordResetToken.mock.calls.length).toBe(1)
      expect(tokenIntegrator.generatePasswordResetToken.mock.calls[0][0]).toBe(mockUserId)
      expect(tokenIntegrator.generatePasswordResetToken.mock.calls[0][1]).toBe(mockResetKey)
    })

    it('should call emailIntegrator.sendSingleRecipientEmail with the user email and email bodies with password token', () => {
      const mockUserEmail = BusinessUser.create.mock.results[0].value.email
      const passwordResetToken = tokenIntegrator.generatePasswordResetToken.mock.results[0].value
      expect(sendSingleRecipientEmail.mock.calls.length).toBe(1)
      expect(sendSingleRecipientEmail.mock.calls[0][0].address).toBe(mockUserEmail)
      expect(sendSingleRecipientEmail.mock.calls[0][0].textBody).toEqual(expect.stringMatching(passwordResetToken))
      expect(sendSingleRecipientEmail.mock.calls[0][0].htmlBody).toEqual(expect.stringMatching(passwordResetToken))
    })
  })
})
