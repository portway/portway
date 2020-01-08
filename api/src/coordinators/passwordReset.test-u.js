import passwordResetCoordinator from './passwordReset'
import BusinessUser from '../businesstime/user'
import tokenIntegrator from '../integrators/token'
import passwordResetKey from '../libs/passwordResetKey'
import { sendSingleRecipientEmail } from '../integrators/email'
import passwords from '../libs/passwords'

jest.mock('../businesstime/user')
jest.mock('../integrators/token')
jest.mock('../libs/passwordResetKey')
jest.mock('../libs/passwords')
jest.mock('../integrators/email')

describe('password reset coordinator', () => {
  const email = 'faceoff@johntravolta.gov'
  const orgId = 987654
  const userId = 66776

  describe('#initiatePasswordReset', () => {
    beforeAll(async () => {
      BusinessUser.findByEmail.mockReturnValueOnce({ id: userId, orgId, email })
      await passwordResetCoordinator.initiatePasswordReset(email)
    })

    it('should call BusinessUser.findByEmail with the passed in email', () => {
      expect(BusinessUser.findByEmail.mock.calls.length).toBe(1)
      expect(BusinessUser.findByEmail.mock.calls[0][0]).toBe(email)
    })

    it('should call passwordResetKey.generate', () => {
      expect(passwordResetKey.generate.mock.calls.length).toBe(1)
    })

    it('should call BusinessUser.updateById with the correct body', () => {
      const user = BusinessUser.findByEmail.mock.results[0].value
      const mockResetKey = passwordResetKey.generate.mock.results[0].value
      expect(BusinessUser.updateById.mock.calls.length).toBe(1)
      expect(BusinessUser.updateById.mock.calls[0][0]).toEqual(user.id)
      expect(BusinessUser.updateById.mock.calls[0][1]).toEqual({
        resetKey: mockResetKey,
      })
      expect(BusinessUser.updateById.mock.calls[0][2]).toEqual(orgId)
    })

    it('should call tokenIntegrator.generatePasswordResetToken with the user id and reset key', () => {
      const mockResetKey = passwordResetKey.generate.mock.results[0].value
      expect(tokenIntegrator.generatePasswordResetToken.mock.calls.length).toBe(1)
      expect(tokenIntegrator.generatePasswordResetToken.mock.calls[0][0]).toBe(userId)
      expect(tokenIntegrator.generatePasswordResetToken.mock.calls[0][1]).toBe(mockResetKey)
    })

    it('should call emailIntegrator.sendSingleRecipientEmail with the user email and email bodies with password token', () => {
      const passwordResetToken = tokenIntegrator.generatePasswordResetToken.mock.results[0].value
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
