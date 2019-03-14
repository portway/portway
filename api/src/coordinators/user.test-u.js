import userCoordinator from './user'
import BusinessUser from '../businesstime/user'
import passwords from '../libs/passwords'

jest.mock('../businesstime/user')
jest.mock('../libs/passwords')

describe('user coordinator', () => {
  const email = 'hughjackman@johntravolta.gov'
  const password = 'swordfish'

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

  describe('validateEmailPasswordCombo', () => {
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
})
