import UserBusiness from './user'
import UserFactory from '../db/__test-setup__/factories/user'
import initializeTestDb from '../db/__test-setup__/initialize-test-db'

describe('UserBusiness', () => {
  beforeAll(async() => {
    await initializeTestDb()
    await UserFactory.createMany(5)
  })

  describe('findAllSanitized', async() => {
    let users

    beforeAll(async() => {
      users = await UserBusiness.findAllSanitized()
    })

    it('should return all users', () => {
      expect(users.length).toBe(5)
    })

    it('should return sanitized users', () => {
      for (const user in users) {
        expect(user.password).toBe(undefined)
      }
    })
  })
})