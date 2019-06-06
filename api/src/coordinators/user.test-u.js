import userCoordinator from './user'
import BusinessUser from '../businesstime/user'
import passwords from '../libs/passwords'
import passwordResetKey from '../libs/passwordResetKey'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'
import tokenIntegrator from '../integrators/token'
import BusinessProjectUser from '../businesstime/projectuser'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import emailCoordinator from '../coordinators/email'

jest.mock('../businesstime/user')
jest.mock('../businesstime/projectuser')

jest.mock('../libs/passwords')
jest.mock('../libs/passwordResetKey')
jest.mock('../integrators/token')
jest.mock('../coordinators/email')

describe('user coordinator', () => {
  const email = 'hughjackman@johntravolta.gov'
  const password = 'swordfish'
  const userId = 1
  const orgId = 0

  describe('#updatePassword', () => {
    beforeAll(async () => {
      await userCoordinator.updatePassword(email, password)
    })

    it('should call passwords.generateHash with the correct password', () => {
      expect(passwords.generateHash.mock.calls.length).toBe(1)
      expect(passwords.generateHash.mock.calls[0][0]).toBe(password)
    })

    it('should call BusinessUser.updateByEmail with the correct email and body', () => {
      const mockHashedPassword = passwords.generateHash.mock.results[0].value
      expect(BusinessUser.updateByEmail.mock.calls.length).toBe(1)
      expect(BusinessUser.updateByEmail.mock.calls[0][0]).toBe(email)
      expect(BusinessUser.updateByEmail.mock.calls[0][1]).toEqual({
        password: mockHashedPassword
      })
    })
  })

  describe('#setInitialPassword', () => {
    const mockUserWithoutPassword = {
      id: 8675309,
      name: 'not-a-real Name',
      email: 'not-a-real-email@email.com',
      orgId: 666,
      resetKey: 'not-a-real-reset-key'
    }

    let token

    beforeAll(async () => {
      passwords.generateHash.mockReset()
      BusinessUser.setFindByIdReturnValue(mockUserWithoutPassword)
      token = await userCoordinator.setInitialPassword(userId, password)
    })

    afterAll(() => {
      BusinessUser.resetFindByIdReturnValue()
    })

    it('should call BusinessUser.findById with the correct id', () => {
      expect(BusinessUser.findById.mock.calls.length).toBe(1)
      expect(BusinessUser.findById.mock.calls[0][0]).toBe(userId)
    })

    it('should call passwords.generateHash with the correct password', () => {
      expect(passwords.generateHash.mock.calls.length).toBe(1)
      expect(passwords.generateHash.mock.calls[0][0]).toBe(password)
    })

    it('should call BusinessUser.updateById with the correct id and body', () => {
      const mockHashedPassword = passwords.generateHash.mock.results[0].value
      const mockUserId = BusinessUser.findById.mock.results[0].value.id
      expect(BusinessUser.updateById.mock.calls.length).toBe(1)
      expect(BusinessUser.updateById.mock.calls[0][0]).toBe(mockUserId)
      expect(BusinessUser.updateById.mock.calls[0][1]).toEqual({
        password: mockHashedPassword,
        resetKey: null
      })
    })

    it('should call tokenIntegrator.generateToken with the correct data', () => {
      const mockUser = BusinessUser.findById.mock.results[0].value
      expect(tokenIntegrator.generateToken.mock.calls.length).toBe(1)
      expect(tokenIntegrator.generateToken.mock.calls[0][0]).toBe(mockUser.id)
      expect(tokenIntegrator.generateToken.mock.calls[0][1]).toBe(mockUser.orgRoleId)
      expect(tokenIntegrator.generateToken.mock.calls[0][2]).toBe(mockUser.orgId)
    })

    it('should return an access token', () => {
      const mockToken = tokenIntegrator.generateToken.mock.results[0].value
      expect(token).toEqual(mockToken)
    })
  })

  describe('#validateEmailPasswordCombo', () => {
    describe('when a valid email/password combo is passed', () => {
      let returnVal

      beforeAll(async () => {
        returnVal = await userCoordinator.validateEmailPasswordCombo(email, password)
      })

      it('should call BusinessUser.findByEmail with the correct email', () => {
        expect(BusinessUser.findByEmail.mock.calls.length).toBe(1)
        expect(BusinessUser.findByEmail.mock.calls[0][0]).toBe(email)
      })

      it('should call passwords.validatePassword with the correct email and password', () => {
        const mockUser = BusinessUser.findByEmail.mock.results[0].value
        expect(passwords.validatePassword.mock.calls.length).toBe(1)
        expect(passwords.validatePassword.mock.calls[0][0]).toBe(password)
        expect(passwords.validatePassword.mock.calls[0][1]).toBe(mockUser.password)
      })

      it('should return the user object', () => {
        const mockUser = BusinessUser.findByEmail.mock.results[0].value
        expect(returnVal).toEqual(mockUser)
      })
    })

    describe('when the user with provided email is not found', () => {
      beforeAll(() => {
        BusinessUser.findByEmail.mockResolvedValueOnce(undefined)
      })

      it('should throw an error', async () => {
        await expect(userCoordinator.validateEmailPasswordCombo(email, password)).rejects.toThrow()
      })
    })

    describe('when the provided password does not match the user password', () => {
      beforeAll(() => {
        passwords.validatePassword.mockResolvedValueOnce(false)
      })

      it('should throw an error', async () => {
        await expect(userCoordinator.validateEmailPasswordCombo(email, password)).rejects.toThrow()
      })
    })
  })

  describe('#validatePasswordResetKey', () => {
    describe('when the target user is not found', () => {
      beforeAll(async () => {
        BusinessUser.setFindByIdReturnValue(null)
      })

      afterAll(() => {
        BusinessUser.resetFindByIdReturnValue()
      })

      it('should throw an error', async () => {
        // eslint-disable-next-line max-len
        await expect(userCoordinator.validatePasswordResetKey(1, 'some-key-definitely-not-real')).rejects.toThrow()
      })
    })

    describe('when the passed in reset key does not match the key stored on the user', () => {
      beforeAll(async () => {
        BusinessUser.setFindByIdReturnValue({
          resetKey: 'this-one-wont-match'
        })
      })

      afterAll(() => {
        BusinessUser.resetFindByIdReturnValue()
      })

      it('should throw an error', async () => {
        // eslint-disable-next-line max-len
        await expect(userCoordinator.validatePasswordResetKey(1, 'some-key-definitely-not-real')).rejects.toThrow()
      })
    })
  })

  describe('#createPendingUser', () => {
    const email = 'not-a-real-email@email.fun'
    const name = 'Fakothy McGee'
    let createdUser

    beforeAll(async () => {
      createdUser = await userCoordinator.createPendingUser(email, name, orgId)
    })

    it('should call passwordResetKey.generate', () => {
      expect(passwordResetKey.generate.mock.calls.length).toBe(1)
    })

    it('should call BusinessUser.create with the correct body', () => {
      const mockResetKey = passwordResetKey.generate.mock.results[0].value
      expect(BusinessUser.create.mock.calls.length).toBe(1)
      expect(BusinessUser.create.mock.calls[0][0]).toEqual({
        email,
        name,
        orgId,
        resetKey: mockResetKey,
        orgRoleId: ORGANIZATION_ROLE_IDS.USER
      })
    })

    it('should call tokenIntegrator.generatePasswordResetToken with the user id and reset key', () => {
      const mockResetKey = passwordResetKey.generate.mock.results[0].value
      const mockUserId = BusinessUser.create.mock.results[0].value.id
      expect(tokenIntegrator.generatePasswordResetToken.mock.calls.length).toBe(1)
      expect(tokenIntegrator.generatePasswordResetToken.mock.calls[0][0]).toBe(mockUserId)
      expect(tokenIntegrator.generatePasswordResetToken.mock.calls[0][1]).toBe(mockResetKey)
    })

    it('should call emailCoordinator.sendInvitationEmail with the email, token, and orgId', () => {
      const token = tokenIntegrator.generatePasswordResetToken.mock.results[0].value
      const mockEmail = BusinessUser.create.mock.results[0].value.email
      expect(emailCoordinator.sendInvitationEmail.mock.calls.length).toBe(1)
      expect(emailCoordinator.sendInvitationEmail.mock.calls[0][0]).toBe(mockEmail)
      expect(emailCoordinator.sendInvitationEmail.mock.calls[0][1]).toBe(token)
      expect(emailCoordinator.sendInvitationEmail.mock.calls[0][2]).toBe(orgId)
    })

    it('should return the created user with only public fields exposed', () => {
      expect(Object.keys(createdUser)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.USER]))
    })
  })

  describe('#deleteById', () => {
    beforeAll(async () => {
      await userCoordinator.deleteById(userId, orgId)
    })

    it('should call BusinessUser.deleteById', () => {
      expect(BusinessUser.deleteById.mock.calls.length).toBe(1)
      expect(BusinessUser.deleteById.mock.calls[0][0]).toBe(userId)
      expect(BusinessUser.deleteById.mock.calls[0][1]).toBe(orgId)
    })

    it('should call BusinessProjectUser.removeAllProjectAssignmentsForUser', () => {
      expect(BusinessProjectUser.removeAllProjectAssignmentsForUser.mock.calls.length).toBe(1)
      expect(BusinessProjectUser.removeAllProjectAssignmentsForUser.mock.calls[0][0]).toBe(userId)
      expect(BusinessProjectUser.removeAllProjectAssignmentsForUser.mock.calls[0][1]).toBe(orgId)
    })
  })
})
