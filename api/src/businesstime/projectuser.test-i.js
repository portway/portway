import BusinessProjectUser from './projectuser'
import ProjectFactory from '../db/__testSetup__/factories/project'
import UserFactory from '../db/__testSetup__/factories/user'
import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'
import constants from '../db/__testSetup__/constants'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'

const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.PROJECT_USER]

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
          projectId
        }))
      })
    })

    describe('with different orgIds', () => {
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

    describe('assign a project from a different org', () => {
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
      it('should return project user assignments', () => {
        expect(projectUsers.length).toEqual(4)
        const projectUser = projectUsers[0]
        expect(Object.keys(projectUser)).toEqual(expect.arrayContaining(PUBLIC_FIELDS))
      })

      it('should return POJO users', () => {
        const projectUser = projectUsers[0]
        expect(projectUser.constructor).toBe(Object)
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

  describe('#findAllProjectAssignmentsForUser', () => {
    let factoryProjects
    let factoryUser
    let userProjectAssignments

    beforeAll(async () => {
      await clearDb()
      factoryProjects = await ProjectFactory.createMany(4, { orgId: constants.ORG_ID })
      factoryUser = (await UserFactory.createMany(1, { orgId: constants.ORG_ID }))[0]
      await Promise.all(
        factoryProjects.map(p =>
          BusinessProjectUser.create({
            userId: factoryUser.id,
            orgId: constants.ORG_ID,
            roleId: 3,
            projectId: p.id
          })
        )
      )

      userProjectAssignments = await BusinessProjectUser.findAllProjectAssignmentsForUser(factoryUser.id, constants.ORG_ID)
    })

    it('should return project user assignments', () => {
      expect(userProjectAssignments.length).toEqual(4)
      const factoryProjectIds = factoryProjects.map(p => p.id)
      const userProjectAssignmentProjectIds = userProjectAssignments.map(a => a.projectId)
      expect(factoryProjectIds).toEqual(expect.arrayContaining(userProjectAssignmentProjectIds))
    })

    it('should return POJO assignments', () => {
      userProjectAssignments.forEach((assignment) => {
        expect(assignment.constructor).toBe(Object)
        expect(Object.keys(assignment)).toEqual(expect.arrayContaining(PUBLIC_FIELDS))
      })
    })
  })

  describe('#deleteByIdForProject', () => {
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
      projectUsers = await BusinessProjectUser.findAllByProjectId(project.id, constants.ORG_ID)
    })

    it('should delete a user project assignment', async () => {
      const projectUser = projectUsers[0]
      expect(projectUsers.length).toBe(2)
      expect(Object.keys(projectUser)).toEqual(expect.arrayContaining(PUBLIC_FIELDS))

      await expect(
        BusinessProjectUser.deleteByIdForProject(projectUser.id, project.id, constants.ORG_ID)
      ).resolves.toEqual(undefined)

      const projectUsersAfterDelete = await BusinessProjectUser.findAllByProjectId(
        project.id,
        constants.ORG_ID
      )
      expect(projectUsersAfterDelete.length).toBe(1)
      expect(projectUsersAfterDelete[0].id).not.toBe(projectUser.id)
    })
  })

  describe('#updateProjectUserById', () => {
    describe('with valid data', () => {
      const roleId = 1
      const updatedRoleId = 2
      let projectUser
      beforeAll(async () => {
        await clearDb()
        const project = (await ProjectFactory.createMany(1, { orgId: constants.ORG_ID }))[0]
        const user = (await UserFactory.createMany(1, { orgId: constants.ORG_ID }))[0]

        const newProjUser = await BusinessProjectUser.create({
          userId: user.id,
          orgId: constants.ORG_ID,
          roleId,
          projectId: project.id
        })

        projectUser = await BusinessProjectUser.updateProjectUserById(
          newProjUser.id,
          updatedRoleId,
          constants.ORG_ID
        )
      })
      it("should update a user's project role", () => {
        expect(projectUser.roleId).toBe(updatedRoleId)
      })
    })
    describe('with invalid data', () => {
      describe('id', () => {
        it('missing should throw an error', async () => {
          await expect(
            BusinessProjectUser.updateProjectUserById(undefined, 2, constants.orgId)
          ).rejects.toThrow()
        })
        it('incorrect should throw an error', async () => {
          await expect(BusinessProjectUser.updateProjectUserById(1234, 2, constants.orgId)
          ).rejects.toThrow()
        })
      })
    })
  })
})


