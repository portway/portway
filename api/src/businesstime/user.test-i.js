import UserBusiness from './user'
import UserFactory from '../db/__testSetup__/factories/user'
import initializeTestDb from '../db/__testSetup__/initializeTestDb'

describe('UserBusiness', () => {
  let factoryUsers

  beforeAll(async() => {
    await initializeTestDb()
    factoryUsers = await UserFactory.createMany(5)
  })

  describe('findAllSanitized', async() => {
    let users

    beforeAll(async() => {
      users = await UserBusiness.findAllSanitized()
    })

    it('should return all users', () => {
      expect(users.length).toBe(5)
    })

    it('should return sanitized users as POJOs', () => {
      for (const user of users) {
        expect(user.password).toBe(undefined)
        expect(user).toBeInstanceOf(Object)
      }
    })
  })

  describe('findSanitizedById', async () => {
    let targetUserId
    let user

    beforeAll(async () => {
      targetUserId = factoryUsers[0].get('id')
      user = await UserBusiness.findSanitizedById(targetUserId)
    })

    it('should return a sanitized user as POJO', () => {
      expect(user.password).toBe(undefined)
      expect(user.id).toBe(targetUserId)
      expect(user).toBeInstanceOf(Object)
    })
  })
})