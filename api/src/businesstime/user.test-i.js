import BusinessUser from './user'
import UserFactory from '../db/__testSetup__/factories/user'
import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'
import constants from '../db/__testSetup__/constants'

describe('BusinessUser', () => {
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
      user = await BusinessUser.create(userBody)
    })

    it('should return the saved user as a POJO', () => {
      expect(user).toEqual(expect.objectContaining(userBody))
      expect(user.constructor).toBe(Object)
    })
  })

  describe('#updateById', () => {
    describe('when the target user is found', () => {
      let user
      const updateBody = { firstName: 'an-updated-name' }

      beforeAll(async () => {
        const factoryUsers = await UserFactory.createMany(1)
        user = await BusinessUser.updateById(
          factoryUsers[0].id,
          updateBody
        )
      })

      it('should return a POJO with updated body fields', () => {
        expect(user).toEqual(expect.objectContaining(updateBody))
        expect(user.constructor).toBe(Object)
      })
    })

    describe('when the target user is not found', () => {
      it('should throw an error', async () => {
        await expect(BusinessUser.updateById(7878787)).rejects.toThrow()
      })
    })
  })

  describe('#updateByEmail', () => {
    describe('when the target user is found', () => {
      let user
      const updateBody = { firstName: 'an-updated-name' }

      beforeAll(async () => {
        const factoryUsers = await UserFactory.createMany(1)
        user = await BusinessUser.updateByEmail(factoryUsers[0].email, updateBody)
      })

      it('should return a POJO with updated body fields', () => {
        expect(user).toEqual(expect.objectContaining(updateBody))
        expect(user.constructor).toBe(Object)
      })
    })

    describe('when the target user is not found', () => {
      it('should throw an error', async () => {
        await expect(BusinessUser.updateByEmail('notanemail@fake.net')).rejects.toThrow()
      })
    })
  })

  describe('user fetching', () => {
    let factoryUsers

    beforeAll(async () => {
      await clearDb()
      factoryUsers = await UserFactory.createMany(5)
      // Create users in another org that shouldn't get returned on sanitized endpoint
      await UserFactory.createMany(3, { orgId: constants.ORG_2_ID })
    })

    describe('findByEmail', () => {
      let targetUser
      let user

      beforeAll(async () => {
        targetUser = factoryUsers[0]
        user = await BusinessUser.findByEmail(targetUser.email)
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
        user = await BusinessUser.findById(targetUser.id)
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
        users = await BusinessUser.findAllSanitized(constants.ORG_ID)
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

      describe('when the target user has the passed in orgId', () => {
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

      describe('when the user does not have the passed in orgId', () => {
        beforeAll(async () => {
          targetUserId = factoryUsers[0].get('id')
          user = await BusinessUser.findSanitizedById(targetUserId, constants.ORG_ID_2)
        })

        it('should return null', async () => {
          expect(user).toBe(null)
        })
      })
    })
  })
})