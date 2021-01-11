import emailCoordinator from './email'
import BusinessOrganization from '../businesstime/organization'
import { sendSingleRecipientEmail } from '../integrators/email'

jest.mock('../businesstime/organization')
jest.mock('../integrators/email')

describe('emailCoordinator', () => {

  describe('#sendInvitationEmail', () => {
    const email = 'not-a-real-invitation-email'
    const passwordResetToken = 'not-a-real-invitation-token'
    const orgId = 0

    beforeAll(async () => {
      await emailCoordinator.sendInvitationEmail(email, passwordResetToken, orgId)
    })

    it('should call BusinessOrganization.findSanitizedById with the passed in orgId', () => {
      expect(BusinessOrganization.findSanitizedById.mock.calls.length).toBe(1)
      expect(BusinessOrganization.findSanitizedById.mock.calls[0][0]).toEqual(orgId)
    })

    it('should call emailIntegrator.sendSingleRecipientEmail with the user email and email bodies with password token', () => {
      expect(sendSingleRecipientEmail.mock.calls.length).toBe(1)
      expect(sendSingleRecipientEmail.mock.calls[0][0].address).toBe(email)
      expect(sendSingleRecipientEmail.mock.calls[0][0].textBody).toEqual(
        expect.stringMatching(passwordResetToken)
      )
      expect(sendSingleRecipientEmail.mock.calls[0][0].htmlBody).toEqual(
        expect.stringMatching(passwordResetToken)
      )
    })
  })

  describe('#sendPasswordChangeEmail', () => {
    const email = 'hello@portway.com'

    beforeAll(async () => {
      sendSingleRecipientEmail.mockClear()
      await emailCoordinator.sendPasswordChangeEmail(email)
    })

    it('should call emailIntegrator.sendPasswordChangeEmail', () => {
      expect(sendSingleRecipientEmail.mock.calls.length).toBe(1)
      expect(sendSingleRecipientEmail.mock.calls[0][0].address).toBe(email)
    })
  })

  describe('#sendPasswordResetEmail', () => {
    const email = 'hello@portway.com'
    const link = 'not-a-real-link'

    beforeAll(async () => {
      sendSingleRecipientEmail.mockClear()
      await emailCoordinator.sendPasswordResetEmail(link, email)
    })

    it('should call emailIntegrator.sendPasswordResetEmail', () => {
      expect(sendSingleRecipientEmail.mock.calls.length).toBe(1)
      expect(sendSingleRecipientEmail.mock.calls[0][0].address).toBe(email)
      expect(sendSingleRecipientEmail.mock.calls[0][0].textBody).toEqual(
        expect.stringMatching(link)
      )
      expect(sendSingleRecipientEmail.mock.calls[0][0].htmlBody).toEqual(
        expect.stringMatching(link)
      )
    })
  })

  describe('#sendFreeAccountInvite', () => {
    const email = 'hello@portway.com'
    const link = 'not-a-real-link'

    beforeAll(async () => {
      sendSingleRecipientEmail.mockClear()
      await emailCoordinator.sendFreeAccountInvite(link, email)
    })

    it('should call emailIntegrator.sendFreeAccountInvite', () => {
      expect(sendSingleRecipientEmail.mock.calls.length).toBe(1)
      expect(sendSingleRecipientEmail.mock.calls[0][0].address).toBe(email)
      expect(sendSingleRecipientEmail.mock.calls[0][0].textBody).toEqual(
        expect.stringMatching(link)
      )
      expect(sendSingleRecipientEmail.mock.calls[0][0].htmlBody).toEqual(
        expect.stringMatching(link)
      )
    })
  })

  describe('#sendSignupVerification', () => {
    const email = 'hello@portway.com'
    const link = 'not-a-real-link'

    beforeAll(async () => {
      sendSingleRecipientEmail.mockClear()
      await emailCoordinator.sendSignupVerification(link, email)
    })

    it('should call emailIntegrator.sendSignupVerification', () => {
      expect(sendSingleRecipientEmail.mock.calls.length).toBe(1)
      expect(sendSingleRecipientEmail.mock.calls[0][0].address).toBe(email)
      expect(sendSingleRecipientEmail.mock.calls[0][0].textBody).toEqual(
        expect.stringMatching(link)
      )
      expect(sendSingleRecipientEmail.mock.calls[0][0].htmlBody).toEqual(
        expect.stringMatching(link)
      )
    })
  })

  describe('#sendPaymentFailed', () => {
    const email = 'hello@portway.com'

    beforeAll(async () => {
      sendSingleRecipientEmail.mockClear()
      await emailCoordinator.sendPaymentFailed(email)
    })

    it('should call emailIntegrator.sendPaymentFailed', () => {
      expect(sendSingleRecipientEmail.mock.calls.length).toBe(1)
      expect(sendSingleRecipientEmail.mock.calls[0][0].address).toBe(email)
    })
  })

  describe('#sendPaymentSuccess', () => {
    const email = 'hello@portway.com'
    const amount = '2000'

    beforeAll(async () => {
      sendSingleRecipientEmail.mockClear()
      await emailCoordinator.sendPaymentSuccess(email, amount)
    })

    it('should call emailIntegrator.sendPaymentSuccess', () => {
      expect(sendSingleRecipientEmail.mock.calls.length).toBe(1)
      expect(sendSingleRecipientEmail.mock.calls[0][0].address).toBe(email)
      expect(sendSingleRecipientEmail.mock.calls[0][0].htmlBody).toMatch(/20.00/)
      expect(sendSingleRecipientEmail.mock.calls[0][0].textBody).toMatch(/20.00/)
    })
  })

  describe('#sendSubscriptionCanceled', () => {
    const email = 'hello@portway.com'

    beforeAll(async () => {
      sendSingleRecipientEmail.mockClear()
      await emailCoordinator.sendSubscriptionCanceled(email)
    })

    it('should call emailIntegrator.sendSubscriptionCanceled', () => {
      expect(sendSingleRecipientEmail.mock.calls.length).toBe(1)
      expect(sendSingleRecipientEmail.mock.calls[0][0].address).toBe(email)
    })
  })

  describe('#sendTrialWillEnd', () => {
    const email = 'hello@portway.com'

    beforeAll(async () => {
      sendSingleRecipientEmail.mockClear()
      await emailCoordinator.sendTrialWillEnd(email)
    })

    it('should call emailIntegrator.sendTrialWillEnd', () => {
      expect(sendSingleRecipientEmail.mock.calls.length).toBe(1)
      expect(sendSingleRecipientEmail.mock.calls[0][0].address).toBe(email)
    })
  })

  describe('#sendTrialEnded', () => {
    const email = 'hello@portway.com'

    beforeAll(async () => {
      sendSingleRecipientEmail.mockClear()
      await emailCoordinator.sendTrialEnded(email)
    })

    it('should call emailIntegrator.sendTrialEnded', () => {
      expect(sendSingleRecipientEmail.mock.calls.length).toBe(1)
      expect(sendSingleRecipientEmail.mock.calls[0][0].address).toBe(email)
    })
  })

})
