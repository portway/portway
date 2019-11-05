import BusinessUser from './user'
import UserFactory from '../db/__testSetup__/factories/user'
import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'
import constants from '../db/__testSetup__/constants'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'

describe('BusinessUser', () => {
  beforeAll(async () => {
    await initializeTestDb()
  })

  describe('#create', () => {
    const userBody = {
      name: 'user name',
      email: 'user@email.com',
      orgId: constants.ORG_ID,
      orgRoleId: ORGANIZATION_ROLE_IDS.ADMIN
    }
    let user

    beforeAll(async () => {
      user = await BusinessUser.create(userBody)
    })

    it('should return the saved user as a POJO', () => {
      // eslint-disable-next-line no-unused-vars
      const { orgId, ...expectedBody } = userBody
      expect(user).toEqual(expect.objectContaining(expectedBody))
      expect(user.constructor).toBe(Object)
    })
  })

  describe('#updateById', () => {
    describe('when the target user is found', () => {
      let user
      const updateBody = { name: 'an-updated-name' }

      beforeAll(async () => {
        const factoryUsers = await UserFactory.createMany(1)
        user = await BusinessUser.updateById(
          factoryUsers[0].id,
          updateBody,
          constants.ORG_ID
        )
      })

      it('should return a POJO with updated body fields', () => {
        expect(user).toEqual(expect.objectContaining(updateBody))
        expect(user.constructor).toBe(Object)
      })
    })

    describe('when the target user is not found', () => {
      it('should throw an error', async () => {
        await expect(BusinessUser.updateById(0)).rejects.toThrow()
      })
    })
  })

  describe('#updateByEmail', () => {
    describe('when the target user is found', () => {
      let user
      const updateBody = { name: 'an-updated-name' }

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
        users = (
          await BusinessUser.findAllSanitized(constants.ORG_ID, { page: 1, perPage: 1000 })
        ).users
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
          expect(Object.keys(user)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.USER]))
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

  describe('#updateOrgRole', () => {
    describe('when the target user is found', () => {
      let user

      beforeAll(async () => {
        const factoryUser = (await UserFactory.createMany(1))[0]
        user = await BusinessUser.updateOrgRole(factoryUser.id, ORGANIZATION_ROLE_IDS.ADMIN, constants.ORG_ID)
      })

      it('should update the user', () => {
        expect(user.orgRoleId).toEqual(ORGANIZATION_ROLE_IDS.ADMIN)
        expect(user.constructor).toBe(Object)
      })
    })

    describe('when the target user is not found', () => {
      it('should throw an error', async () => {
        await expect(BusinessUser.updateOrgRole(0, ORGANIZATION_ROLE_IDS.ADMIN, constants.ORG_ID)).rejects.toEqual(expect.objectContaining({ code: 404 }))
      })
    })

    describe('when the target user is an org owner', () => {
      it('should throw an error', async () => {
        const factoryOrgOwner = (await UserFactory.createMany(1, { orgRoleId: ORGANIZATION_ROLE_IDS.OWNER }))[0]
        await expect(BusinessUser.updateOrgRole(factoryOrgOwner.id, ORGANIZATION_ROLE_IDS.ADMIN, constants.ORG_ID)).rejects.toEqual(expect.objectContaining({ code: 404 }))
      })
    })
  })

  describe('#deleteById', () => {
    let factoryUser

    beforeAll(async () => {
      const factoryUsers = await UserFactory.createMany(1)
      factoryUser = factoryUsers[0]
    })

    it('should not throw an error if the target user is found', async () => {
      await expect(BusinessUser.deleteById(factoryUser.id, factoryUser.orgId)).resolves.toEqual(undefined)
    })

    it('should throw an error if the target user is not found', async () => {
      await expect(BusinessUser.deleteById(0)).rejects.toThrow()
    })
  })

  describe('#findSoftDeletedByEmail', () => {
    let targetUser
    let user

    beforeAll(async () => {
      targetUser = (await UserFactory.createMany(1))[0]
      targetUser.destroy()
      user = await BusinessUser.findSoftDeletedByEmail(targetUser.email)
    })

    it('should return a user as POJO', () => {
      expect(user.id).toBe(targetUser.id)
      expect(user.constructor).toBe(Object)
    })
  })

  describe('#findSoftDeletedByEmail', () => {
    let targetUser
    let user

    beforeAll(async () => {
      targetUser = (await UserFactory.createMany(1))[0]
      targetUser.destroy()
      user = await BusinessUser.findSoftDeletedByEmail(targetUser.email)
    })

    it('should return a user as POJO', () => {
      expect(user.id).toBe(targetUser.id)
      expect(user.constructor).toBe(Object)
    })
  })

  describe('#restoreSoftDeleted', () => {
    let targetUser
    let user
    const resetKey = 'test-reset-key'

    beforeAll(async () => {
      targetUser = (await UserFactory.createMany(1))[0]
      targetUser.destroy()
      user = await BusinessUser.restoreSoftDeleted(targetUser.id, resetKey)
    })

    it('should return a pending POJO user', () => {
      expect(user.pending).toBe(true)
      expect(user.constructor).toBe(Object)
    })

    it('should remove soft deletion from the user, making them retrievable again', async () => {
      const foundUser = await BusinessUser.findById(targetUser.id)
      expect(foundUser).toBeDefined()
      expect(foundUser.resetKey).toBe(resetKey)
    })
  })
})