import ProjectBusiness from './project'
import ProjectFactory from '../db/__testSetup__/factories/project'
import initializeTestDb from '../db/__testSetup__/initializeTestDb'

describe('ProjectBusiness', () => {
  beforeAll(async() => {
    await initializeTestDb()
  })

  describe('#create', async() => {
    const projectBody = { name: 'test-project' }
    let project

    beforeAll(async() => {
      project = await ProjectBusiness.create(projectBody)
    })

    it('should return the saved project as a POJO', () => {
      expect(project).toEqual(expect.objectContaining(projectBody));
      expect(project.constructor).toBe(Object)
    })
  })

  describe('#updateById', async() => {
    describe('when the target document is found', () => {
      let project
      const updateBody = { name: 'an-updated-name' }

      beforeAll(async () => {
        const factoryProjects = await ProjectFactory.createMany(1)
        project = await ProjectBusiness.updateById(factoryProjects[0].id, updateBody)
      })

      it('should return a POJO with updated body fields', () => {
        expect(project).toEqual(expect.objectContaining(updateBody));
        expect(project.constructor).toBe(Object)
      })
    })
    
    describe('when the target document is not found', () => {
      it('should throw an error', async() => {
        await expect(ProjectBusiness.updateById(8675309)).rejects.toThrow()
      })
    })
  })

  describe('document fetching', () => {
    let factoryProjects

    beforeAll(async() => {
      await initializeTestDb()
      factoryProjects = await ProjectFactory.createMany(5)
    })

    describe('#findAll', async () => {
      let projects

      beforeAll(async () => {
        projects = await ProjectBusiness.findAll()
      })

      it('should return all projects', () => {
        expect(projects.length).toEqual(5)
      })

      it('should return projects as POJOs', () => {
        for (const project of projects) {
          expect(project.password).toBe(undefined)
          expect(project.constructor).toBe(Object)
        }
      })
    })

    describe('#findById', async () => {
      let targetProjectId
      let project

      beforeAll(async () => {
        targetProjectId = factoryProjects[0].get('id')
        project = await ProjectBusiness.findById(targetProjectId)
      })

      it('should return a project as POJO', () => {
        expect(project.id).toBe(targetProjectId)
        expect(project.constructor).toBe(Object)
      })
    })
  })
})