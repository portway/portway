import signUpCoordinator from '../coordinators/signUp'
import BusinessUser from '../businesstime/user'
import BusinessOrganization from '../businesstime/organization'
import tokenIntegrator from '../integrators/token'
import passwordResetKey from '../libs/passwordResetKey'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'

jest.mock('../businesstime/user')
jest.mock('../businesstime/organization')
jest.mock('../integrators/token')
jest.mock('../libs/passwordResetKey')

describe('signUp coordinator', () => {
  const firstName = 'Nicolas'
  const lastName = 'Cage'
  const email = 'faceoff@johntravolta.gov'

  describe('#createUserAndOrganization', () => {
    let passwordResetToken

    beforeAll(async () => {
      passwordResetToken = await signUpCoordinator.createUserAndOrganization(
        firstName,
        lastName,
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
        firstName,
        lastName,
        email,
        orgId: mockOrgId,
        resetKey: mockResetKey,
        orgRoleId: ORGANIZATION_ROLE_IDS.OWNER
      })
    })

    // eslint-disable-next-line max-len
    it('should call tokenIntegrator.generatePasswordResetToken with the user id and reset key', () => {
      const mockResetKey = passwordResetKey.generate.mock.results[0].value
      const mockUserId = BusinessUser.create.mock.results[0].value.id
      expect(tokenIntegrator.generatePasswordResetToken.mock.calls.length).toBe(1)
      expect(tokenIntegrator.generatePasswordResetToken.mock.calls[0][0]).toBe(mockUserId)
      expect(tokenIntegrator.generatePasswordResetToken.mock.calls[0][1]).toBe(mockResetKey)
    })

    it('should return the generated password reset token', () => {
      const mockResetToken = tokenIntegrator.generatePasswordResetToken.mock.results[0].value
      expect(passwordResetToken).toBe(mockResetToken)
    })
  })
})
