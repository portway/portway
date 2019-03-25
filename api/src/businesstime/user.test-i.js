import BusinessUser from './user'
import UserFactory from '../db/__testSetup__/factories/user'
import initializeTestDb from '../db/__testSetup__/initializeTestDb'
import constants from '../db/__testSetup__/constants'

describe('BusinessUser', () => {
  let factoryUsers

  beforeAll(async () => {
    await initializeTestDb()
    factoryUsers = await UserFactory.createMany(5)
  })

  describe('findAllSanitized', () => {
    let users

    beforeAll(async () => {
      users = await BusinessUser.findAllSanitized(constants.ORG_ID)
    })

    it('should return all users', () => {
      expect(users.length).toBe(5)
    })

    it('should return sanitized users as POJOs', () => {
      for (const user of users) {
        expect(user.password).toBe(undefined)
        expect(user.constructor).toBe(Object)
        expect(user.orgId).toBe(constants.ORG_ID)
      }
    })
  })

  describe('findSanitizedById', () => {
    let targetUserId
    let user

    beforeAll(async () => {
      targetUserId = factoryUsers[0].get('id')
      user = await BusinessUser.findSanitizedById(targetUserId, constants.ORG_ID)
    })

    it('should return a sanitized user as POJO', () => {
      expect(user.password).toBe(undefined)
      expect(user.id).toBe(targetUserId)
      expect(user.constructor).toBe(Object)
      expect(user.orgId).toBe(constants.ORG_ID)
    })
  })
})