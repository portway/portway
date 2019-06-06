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
})
