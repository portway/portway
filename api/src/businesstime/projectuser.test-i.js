import BusinessProjectUser from './projectuser'
import ProjectFactory from '../db/__testSetup__/factories/project'
import UserFactory from '../db/__testSetup__/factories/user'
import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'
import constants from '../db/__testSetup__/constants'
import { PUBLIC_FIELDS as USER_PUBLIC_FIELDS } from './user'

describe('BusinessProjectUser', () => {
  beforeAll(async () => {
    await initializeTestDb()
  })

  describe('#create', () => {
    let projectUserBody
    let projectUser

    beforeAll(async () => {
      const project = (await ProjectFactory.createMany(1, { orgId: constants.ORG_ID }))[0]
      const user = (await UserFactory.createMany(1, { orgId: constants.ORG_ID }))[0]

      projectUserBody = {
        orgId: constants.ORG_ID,
        userId: user.id,
        projectId: project.id,
        roleId: 2
      }

      projectUser = await BusinessProjectUser.create(projectUserBody)
    })

    it('should create a project user assignment', () => {
      expect(projectUser).toEqual(expect.objectContaining(projectUserBody))
      expect(projectUser.constructor).toBe(Object)
    })
  })

  describe('#addUserIdToProject', () => {
    let projectId
    let users

    beforeAll(async () => {
      const project = (await ProjectFactory.createMany(2, { orgId: constants.ORG_ID }))[0]
      projectId = project.id
      users = await UserFactory.createMany(6, { orgId: constants.ORG_ID })
    })

    describe('assign a user to a project', () => {
      let projectUser
      beforeAll(async () => {
        projectUser = await BusinessProjectUser.addUserIdToProject(
          users[0].id,
          projectId,
          2,
          constants.ORG_ID
        )
      })

      it('should assign the user', () => {
        expect(projectUser).toEqual(expect.objectContaining({
          userId: users[0].id,
          projectId,
          orgId: constants.ORG_ID
        }))
      })
    })

    describe('with different orgIds', async () => {
      let user
      beforeAll(async () => {
        user = (await UserFactory.createMany(1, { orgId: constants.ORG_2_ID }))[0]
      })

      it('on the user should throw an error', async () => {
        await expect(BusinessProjectUser.addUserIdToProject(user.id, projectId, 2, constants.ORG_ID))
          .rejects.toThrow()
      })

      it('on the project should throw an error', async () => {
        await expect(BusinessProjectUser.addUserIdToProject(user.id, projectId, 2, constants.ORG_2_ID))
          .rejects.toThrow()
      })
    })

    describe('assign a project from a different org', async () => {
      let user
      beforeAll(async () => {
        user = (await UserFactory.createMany(1, { orgId: constants.ORG_2_ID }))[0]
      })

      it('should throw an error', async () => {
        await expect(BusinessProjectUser.addUserIdToProject(user.id, projectId, 2, constants.ORG_ID))
          .rejects.toThrow()
      })
    })

    describe('assign user to non-existent project', () => {
      it('should throw an error', async () => {
        await expect(BusinessProjectUser.addUserIdToProject(users[1].id, 0, 2, constants.ORG_ID))
          .rejects.toThrow()
      })
    })

    describe('assign non-existent user to project', () => {
      it('should throw an error', async () => {
        await expect(BusinessProjectUser.addUserIdToProject(0, projectId, 2, constants.ORG_ID))
          .rejects.toThrow()
      })
    })
  })

  describe('#findAllByProjectId', () => {
    let projectUsers

    beforeAll(async () => {
      await clearDb()
      const project = (await ProjectFactory.createMany(1, { orgId: constants.ORG_ID }))[0]
      const projectId = project.id
      const users = await UserFactory.createMany(6, { orgId: constants.ORG_ID })
      await Promise.all(users.slice(0, 4).map(u => BusinessProjectUser.create({
        userId: u.id,
        orgId: constants.ORG_ID,
        roleId: 3,
        projectId
      })))

      projectUsers = await BusinessProjectUser.findAllByProjectId(projectId, constants.ORG_ID)
    })

    describe('when users are assigned to a project', () => {
      it('should return users', () => {
        expect(projectUsers.length).toEqual(4)
        const user = projectUsers[0]
        expect(Object.keys(user)).toEqual(expect.arrayContaining(USER_PUBLIC_FIELDS))
      })

      it('should return POJO users', () => {
        const user = projectUsers[0]
        expect(user.constructor).toBe(Object)
      })
    })

    describe('when no users are assigned to a project', () => {
      let projectUsers

      beforeAll(async () => {
        const project = (await ProjectFactory.createMany(1, { orgId: constants.ORG_2_ID }))[0]
        projectUsers = await BusinessProjectUser.findAllByProjectId(project.id, constants.ORG_2_ID)
      })

      it('should return an empty array', () => {
        expect(projectUsers.length).toBe(0)
      })
    })
  })

  describe('#findByUserIdForProject', () => {
    let userId
    let projectId

    beforeAll(async () => {
      await clearDb()
      projectId = (await ProjectFactory.createMany(1, { orgId: constants.ORG_ID }))[0].id
      userId = (await UserFactory.createMany(1, { orgId: constants.ORG_ID }))[0].id
      await BusinessProjectUser.create({
        userId,
        orgId: constants.ORG_ID,
        roleId: 2,
        projectId
      })
    })

    describe('when the project user assignment exists', () => {
      let user
      beforeAll(async () => {
        user = await BusinessProjectUser.findByUserIdForProject(
          userId,
          projectId,
          constants.ORG_ID
        )
      })

      it('should return a user', () => {
        expect(Object.keys(user)).toEqual(expect.arrayContaining(USER_PUBLIC_FIELDS))
      })
    })

    describe('when a project user assignment does not exist', () => {
      let user
      beforeAll(async () => {
        userId = (await UserFactory.createMany(1, { orgId: constants.ORG_ID }))[0].id
        user = await BusinessProjectUser.findByUserIdForProject(
          userId,
          projectId,
          constants.ORG_ID
        )
      })

      it('should return null', () => {
        expect(user).toBe(null)
      })
    })
  })

  describe('#deleteByUserIdProjectId', () => {
    let projectUsers
    let project

    beforeAll(async () => {
      await clearDb()
      project = (await ProjectFactory.createMany(1, { orgId: constants.ORG_ID }))[0]
      const users = await UserFactory.createMany(3, { orgId: constants.ORG_ID })
      await Promise.all(
        users.slice(0, 2).map(u =>
          BusinessProjectUser.create({
            userId: u.id,
            orgId: constants.ORG_ID,
            roleId: 1,
            projectId: project.id
          })
        )
      )
      projectUsers = (await BusinessProjectUser.findAllByProjectId(project.id, constants.ORG_ID))
    })

    it('should delete a user project assignment', async () => {
      const user = projectUsers[0]
      expect(projectUsers.length).toBe(2)
      expect(Object.keys(user)).toEqual(expect.arrayContaining(USER_PUBLIC_FIELDS))

      await expect(
        BusinessProjectUser.deleteByUserIdForProject(user.id, project.id, constants.ORG_ID)
      ).resolves.toEqual(undefined)

      const usersAfterDelete = await BusinessProjectUser.findAllByProjectId(
        project.id,
        constants.ORG_ID
      )
      expect(usersAfterDelete.length).toBe(1)
      expect(usersAfterDelete[0].id).not.toBe(user.id)
    })
  })
})


