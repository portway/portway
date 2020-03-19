import BusinessProject from './project'
import BusinessProjectUser from './projectuser'
import ProjectFactory from '../db/__testSetup__/factories/project'
import UserFactory from '../db/__testSetup__/factories/user'
import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'
import constants from '../db/__testSetup__/constants'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import PROJECT_ACCESS_LEVELS from '../constants/projectAccessLevels'
import { PROJECT_ROLE_IDS } from '../constants/roles'

const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.PROJECT]

describe('BusinessProject', () => {
  beforeAll(async () => {
    await initializeTestDb()
  })

  describe('#create', () => {
    const projectBody = { name: 'test-project', orgId: constants.ORG_ID }
    let project

    beforeAll(async () => {
      project = await BusinessProject.create(projectBody)
    })

    it('should return the saved project as a POJO', () => {
      // eslint-disable-next-line no-unused-vars
      const { orgId, ...expectedBody } = projectBody
      expect(project).toEqual(expect.objectContaining(expectedBody))
      expect(project.constructor).toBe(Object)
    })
  })

  describe('#updateById', () => {
    describe('when the target project is found', () => {
      let project
      const updateBody = { name: 'an-updated-name' }

      beforeAll(async () => {
        const factoryProjects = await ProjectFactory.createMany(1)
        project = await BusinessProject.updateById(
          factoryProjects[0].id,
          updateBody,
          factoryProjects[0].orgId
        )
      })

      it('should return a POJO with updated body fields', () => {
        expect(project).toEqual(expect.objectContaining(updateBody))
        expect(project.constructor).toBe(Object)
      })
    })

    describe('when the target project is not found', () => {
      it('should throw an error', async () => {
        await expect(BusinessProject.updateById(0)).rejects.toThrow()
      })
    })
  })

  describe('project fetching', () => {
    let factoryProjects

    beforeAll(async () => {
      await clearDb()
      factoryProjects = await ProjectFactory.createMany(5)
      await ProjectFactory.createMany(2, { orgId: constants.ORG_2_ID })
    })

    describe('#findAll', () => {
      let projects
      let count

      beforeAll(async () => {
        ({ projects, count } = await BusinessProject.findAll(constants.ORG_ID, { page: 1, perPage: 3 }))
      })

      it('should return all paged projects in org', () => {
        expect(projects.length).toEqual(3)
      })

      it('should return projects as POJOs', () => {
        for (const project of projects) {
          expect(project.password).toBe(undefined)
          expect(project.constructor).toBe(Object)
          expect(Object.keys(project)).toEqual(expect.arrayContaining(PUBLIC_FIELDS))
        }
      })

      it('should return a project count', () => {
        expect(count).toEqual(5)
      })
    })

    describe('#findById', () => {
      let targetProjectId
      let project

      describe('when the target project has the passed in orgId', () => {
        beforeAll(async () => {
          targetProjectId = factoryProjects[0].get('id')
          project = await BusinessProject.findById(targetProjectId, constants.ORG_ID)
        })

        it('should return a project as POJO', () => {
          expect(project.id).toBe(targetProjectId)
          expect(project.constructor).toBe(Object)
          expect(Object.keys(project)).toEqual(expect.arrayContaining(PUBLIC_FIELDS))
        })
      })

      describe('when the target project does not have the passed in orgId', () => {
        beforeAll(async () => {
          targetProjectId = factoryProjects[0].get('id')
          project = await BusinessProject.findById(targetProjectId, constants.ORG_ID_2)
        })

        it('should return null', () => {
          expect(project).toBe(null)
        })
      })
    })
  })

  describe('#deleteById', () => {
    let factoryProject

    beforeAll(async () => {
      const factoryProjects = await ProjectFactory.createMany(1)
      factoryProject = factoryProjects[0]
    })

    it('should not throw an error if the target project is found', async () => {
      await expect(BusinessProject.deleteById(factoryProject.id, factoryProject.orgId)).resolves.toEqual(undefined)
    })

    it('should throw an error if the target project is not found', async () => {
      await expect(BusinessProject.deleteById(0)).rejects.toThrow()
    })
  })

  describe('#findAllForUser', () => {
    let factoryUser
    let assignedProject
    let publicReadProject
    let publicWriteProject
    let projects
    let count

    beforeAll(async () => {
      await clearDb()
      factoryUser = (await UserFactory.createMany(1))[0]
      const factoryProjects = await ProjectFactory.createMany(3)
      assignedProject = factoryProjects[0]
      publicReadProject = (await ProjectFactory.createMany(1, { accessLevel: PROJECT_ACCESS_LEVELS.READ }))[0]
      publicWriteProject = (await ProjectFactory.createMany(1, { accessLevel: PROJECT_ACCESS_LEVELS.WRITE }))[0]

      await BusinessProjectUser.create({
        orgId: constants.ORG_ID,
        projectId: assignedProject.id,
        userId: factoryUser.id,
        roleId: PROJECT_ROLE_IDS.READER
      })

      await ProjectFactory.createMany(2, { orgId: constants.ORG_2_ID })
    })

    beforeAll(async () => {
      ({ projects, count } = await BusinessProject.findAllForUser(factoryUser.id, constants.ORG_ID, {}))
    })

    it('should return all user assigned projects and public projects in organization', () => {
      expect(projects.length).toEqual(3)
      const projectIds = projects.map(project => project.id)
      expect(projectIds).toEqual(expect.arrayContaining([assignedProject.id, publicReadProject.id, publicWriteProject.id]))
    })

    it('should return projects as POJOs', () => {
      for (const project of projects) {
        expect(project.constructor).toBe(Object)
        expect(Object.keys(project)).toEqual(expect.arrayContaining(PUBLIC_FIELDS))
      }
    })

    it('should return the project count', () => {
      expect(count).toBe(3)
    })
  })
})
