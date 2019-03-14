import UserBusiness from './user'
import UserFactory from '../db/__testSetup__/factories/user'
import initializeTestDb from '../db/__testSetup__/initializeTestDb'

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