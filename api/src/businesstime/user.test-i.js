import UserBusiness from './user'
import UserFactory from '../db/factories/user'

describe('UserBusiness', () => {
  beforeAll(async() => {
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