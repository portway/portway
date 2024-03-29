import signUpCoordinator from './signUp'
import BusinessUser from '../businesstime/user'
import BusinessOrganization from '../businesstime/organization'
import tokenIntegrator from '../integrators/token'
import stripeIntegrator from '../integrators/stripe'
import { sendSingleRecipientEmail } from '../integrators/email'
import { PLANS, TRIAL_PERIOD_DAYS } from '../constants/plans'
import billingCoordinator from './billing'
import introCoordinator from './intro'
import userCoordinator from './user'

jest.mock('../businesstime/user')
jest.mock('../businesstime/organization')
jest.mock('../integrators/token')
jest.mock('../integrators/stripe')
jest.mock('../libs/passwordResetKey')
jest.mock('../integrators/email')
jest.mock('./billing')
jest.mock('./intro')
jest.mock('./user')
jest.mock('./field')

describe('signUp coordinator', () => {
  const name = 'Nicolas Cage'
  const email = 'faceoff@johntravolta.gov'

  describe('#createUserAndOrganization', () => {
    beforeAll(async () => {
      BusinessOrganization.updateById.mockClear()
      BusinessUser.findByEmail.mockReturnValueOnce(undefined)
      userCoordinator.createPendingUser.mockReturnValueOnce({
        name,
        email,
        id: 12,
        resetKey: 'blahblah'
      })
      await signUpCoordinator.createUserAndOrganization(
        name,
        email
      )
    })

    it('should call BusinessUser.findByEmail with the passed in email', () => {
      expect(BusinessUser.findByEmail.mock.calls.length).toBe(1)
      expect(BusinessUser.findByEmail.mock.calls[0][0]).toBe(email)
    })

    it('should call BusinessOrganization.create', () => {
      expect(BusinessOrganization.create.mock.calls.length).toBe(1)
    })

    it('should call userCoordinator.createPendingUser', () => {
      expect(userCoordinator.createPendingUser.mock.calls.length).toBe(1)
      expect(userCoordinator.createPendingUser.mock.calls[0][0]).toEqual(email)
      expect(userCoordinator.createPendingUser.mock.calls[0][1]).toEqual(name)
    })

    it('should call stripeIntegrator.createCustomer with the org name and a description containing owner email', () => {
      const mockOrgName = BusinessOrganization.create.mock.results[0].value.name
      expect(stripeIntegrator.createCustomer.mock.calls.length).toBe(1)
      expect(stripeIntegrator.createCustomer.mock.calls[0][0]).toEqual({ name: mockOrgName, description: expect.stringMatching(email), email })
    })

    it('should call billingCoordinator.createOrUpdateSubscription with the customer id, plan id, trial period, and orgId', () => {
      const customerId = stripeIntegrator.createCustomer.mock.results[0].value.id
      const mockOrgId = BusinessOrganization.create.mock.results[0].value.id
      expect(billingCoordinator.createOrUpdateOrgSubscription.mock.calls.length).toBe(1)
      expect(billingCoordinator.createOrUpdateOrgSubscription.mock.calls[0][0]).toEqual({
        customerId,
        planId: PLANS.PER_USER,
        trialPeriodDays: TRIAL_PERIOD_DAYS,
        orgId: mockOrgId
      })
    })

    it('should call BusinessOrganization.updateById with the org id, owner id, stripe id', () => {
      const stripeId = stripeIntegrator.createCustomer.mock.results[0].value.id
      const mockOrgId = BusinessOrganization.create.mock.results[0].value.id
      const mockOwnerId = userCoordinator.createPendingUser.mock.results[0].value.id
      expect(BusinessOrganization.updateById.mock.calls.length).toBe(1)
      expect(BusinessOrganization.updateById.mock.calls[0][0]).toEqual(mockOrgId)
      expect(BusinessOrganization.updateById.mock.calls[0][1]).toEqual({ ownerId: mockOwnerId, stripeId })
    })

    // eslint-disable-next-line max-len
    it('should call tokenIntegrator.generatePasswordResetToken with the user id and reset key', () => {
      const mockResetKey = userCoordinator.createPendingUser.mock.results[0].value.resetKey
      const mockUserId = userCoordinator.createPendingUser.mock.results[0].value.id
      expect(tokenIntegrator.generatePasswordResetToken.mock.calls.length).toBe(1)
      expect(tokenIntegrator.generatePasswordResetToken.mock.calls[0][0]).toBe(mockUserId)
      expect(tokenIntegrator.generatePasswordResetToken.mock.calls[0][1]).toBe(mockResetKey)
    })

    it('should call emailIntegrator.sendSingleRecipientEmail with the user email and email bodies with password token', () => {
      const mockUserEmail = userCoordinator.createPendingUser.mock.results[0].value.email
      const passwordResetToken = tokenIntegrator.generatePasswordResetToken.mock.results[0].value
      expect(sendSingleRecipientEmail.mock.calls.length).toBe(1)
      expect(sendSingleRecipientEmail.mock.calls[0][0].address).toBe(mockUserEmail)
      expect(sendSingleRecipientEmail.mock.calls[0][0].textBody).toEqual(expect.stringMatching(passwordResetToken))
      expect(sendSingleRecipientEmail.mock.calls[0][0].htmlBody).toEqual(expect.stringMatching(passwordResetToken))
    })

    it('should call introCoordinator.copyIntroProjectToOrg', () => {
      expect(introCoordinator.copyIntroProjectToOrg.mock.calls.length).toBe(1)
    })
  })
})
