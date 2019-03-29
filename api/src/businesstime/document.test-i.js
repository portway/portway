import BusinessDocument from './document'
import ProjectFactory from '../db/__testSetup__/factories/project'
import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'
import constants from '../db/__testSetup__/constants'

describe('BusinessDocument', () => {
  let factoryProject

  beforeAll(async () => {
    await initializeTestDb()
    factoryProject = await ProjectFactory.createMany(1)[0]
  })

  describe('#createForProject', () => {
    const documentBody = {
      name: 'test-document',
      orgId: constants.ORG_ID,
      projectId: factoryProject.id
    }
    let document

    beforeAll(async () => {
      document = await BusinessDocument.create({ documentBody })
    })

    it('should return the saved document as a POJO', () => {
      expect(document).toEqual(expect.objectContaining(documentBody))
      expect(document.constructor).toBe(Object)
      expect(document.orgId).toBe(constants.ORG_ID)
    })

    describe('when the parent project does not exist', () => {
      it('should throw an error', async () => {
        await expect(BusinessDocument.create({ ...documentBody, projectId: 0 })).rejects.toThrow()
      })
    })
  })

  describe('#updateByIdForProject', () => {
    describe('when the target project is found', () => {
      let project
      const updateBody = { name: 'an-updated-name' }

      beforeAll(async () => {
        const factoryProjects = await ProjectFactory.createMany(1)
        project = await BusinessDocument.updateById(factoryProjects[0].id, updateBody)
      })

      it('should return a POJO with updated body fields', () => {
        expect(project).toEqual(expect.objectContaining(updateBody))
        expect(project.constructor).toBe(Object)
      })
    })

    describe('when the target project is not found', () => {
      it('should throw an error', async () => {
        await expect(BusinessDocument.updateByIdForProject(8675309)).rejects.toThrow()
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

      beforeAll(async () => {
        projects = await BusinessDocument.findAll(constants.ORG_ID)
      })

      it('should return all projects in org', () => {
        expect(projects.length).toEqual(5)
      })

      it('should return projects as POJOs', () => {
        for (const project of projects) {
          expect(project.password).toBe(undefined)
          expect(project.constructor).toBe(Object)
          expect(project.orgId).toBe(constants.ORG_ID)
        }
      })
    })

    describe('#findById', () => {
      let targetProjectId
      let project

      describe('when the target project has the passed in orgId', () => {
        beforeAll(async () => {
          targetProjectId = factoryProjects[0].get('id')
          project = await BusinessDocument.findById(targetProjectId, constants.ORG_ID)
        })

        it('should return a project as POJO', () => {
          expect(project.id).toBe(targetProjectId)
          expect(project.constructor).toBe(Object)
          expect(project.orgId).toBe(constants.ORG_ID)
        })
      })

      describe('when the target project does not have the passed in orgId', () => {
        beforeAll(async () => {
          targetProjectId = factoryProjects[0].get('id')
          project = await BusinessDocument.findById(targetProjectId, constants.ORG_ID_2)
        })

        it('should return null', () => {
          expect(project).toBe(null)
        })
      })
    })

    describe('#deleteById', () => {
      let factoryProject

      beforeAll(async () => {
        factoryProjects = await ProjectFactory.createMany(1)
        factoryProject = factoryProjects[0]
      })

      it('should not throw an error if the target project is found', async () => {
        await expect(BusinessDocument.deleteById(factoryProject.id)).resolves.toEqual(undefined)
      })

      it('should throw an error if the target project is not found', async () => {
        await expect(BusinessDocument.deleteById(86753098675309)).rejects.toThrow()
      })
    })
  })
})
