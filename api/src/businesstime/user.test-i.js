import UserBusiness from './user'
import UserFactory from '../db/__testSetup__/factories/user'
import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'

describe('UserBusiness', () => {
  beforeAll(async () => {
    await initializeTestDb()
  })

  describe('#create', () => {
    const userBody = {
      firstName: 'first-name',
      lastName: 'last-name',
      email: 'user@email.com',
      orgId: 1
    }
    let user

    beforeAll(async () => {
      user = await UserBusiness.create(userBody)
    })

    it('should return the saved user as a POJO', () => {
      expect(user).toEqual(expect.objectContaining(userBody))
      expect(user.constructor).toBe(Object)
    })
  })

  describe('#updateById', () => {
    describe('when the target document is found', () => {
      let user
      const updateBody = { firstName: 'an-updated-name' }

      beforeAll(async () => {
        const factoryUsers = await UserFactory.createMany(1)
        user = await UserBusiness.updateById(
          factoryUsers[0].id,
          updateBody
        )
      })

      it('should return a POJO with updated body fields', () => {
        expect(user).toEqual(expect.objectContaining(updateBody))
        expect(user.constructor).toBe(Object)
      })
    })

    describe('when the target document is not found', () => {
      it('should throw an error', async () => {
        await expect(UserBusiness.updateById(7878787)).rejects.toThrow()
      })
    })
  })

  describe('#updateByEmail', () => {
    describe('when the target document is found', () => {
      let user
      const updateBody = { firstName: 'an-updated-name' }

      beforeAll(async () => {
        const factoryUsers = await UserFactory.createMany(1)
        user = await UserBusiness.updateByEmail(factoryUsers[0].email, updateBody)
      })

      it('should return a POJO with updated body fields', () => {
        expect(user).toEqual(expect.objectContaining(updateBody))
        expect(user.constructor).toBe(Object)
      })
    })

    describe('when the target document is not found', () => {
      it('should throw an error', async () => {
        await expect(UserBusiness.updateByEmail('notanemail@fake.net')).rejects.toThrow()
      })
    })
  })

  describe('document fetching', () => {
    let factoryUsers

    beforeAll(async () => {
      await clearDb()
      factoryUsers = await UserFactory.createMany(5)
    })

    describe('findByEmail', () => {
      let targetUser
      let user

      beforeAll(async () => {
        targetUser = factoryUsers[0]
        user = await UserBusiness.findByEmail(targetUser.email)
      })

      it('should return a user as POJO', () => {
        expect(user.password).toBe(targetUser.password)
        expect(user.email).toBe(targetUser.email)
        expect(user.constructor).toBe(Object)
      })
    })

    describe('#findById', () => {
      let targetUser
      let user

      beforeAll(async () => {
        targetUser = factoryUsers[0]
        user = await UserBusiness.findById(targetUser.id)
      })

      it('should return a user as POJO', () => {
        expect(user.password).toBe(targetUser.password)
        expect(user.id).toBe(targetUser.id)
        expect(user.constructor).toBe(Object)
      })
    })

    describe('#findAllSanitized', () => {
      let users

      beforeAll(async () => {
        users = await UserBusiness.findAllSanitized()
      })

      it('should return all users', () => {
        expect(users.length).toBe(5)
      })

      it('should return sanitized users as POJOs', () => {
        for (const user of users) {
          expect(user.password).toBe(undefined)
          expect(user.constructor).toBe(Object)
        }
      })
    })

    describe('#findSanitizedById', () => {
      let targetUserId
      let user

      beforeAll(async () => {
        targetUserId = factoryUsers[0].get('id')
        user = await UserBusiness.findSanitizedById(targetUserId)
      })

      it('should return a sanitized user as POJO', () => {
        expect(user.password).toBe(undefined)
        expect(user.id).toBe(targetUserId)
        expect(user.constructor).toBe(Object)
      })
    })
  })
})