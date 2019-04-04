import BusinessProject from './project'
import ProjectFactory from '../db/__testSetup__/factories/project'
import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'
import constants from '../db/__testSetup__/constants'

describe('BusinessProject', () => {
  beforeAll(async () => {
    await initializeTestDb()
  })

  describe('#findAllByProjectId', () => {
    const projectBody = { name: 'test-project', orgId: constants.ORG_ID }
    let project

    beforeAll(async () => {
      project = await BusinessProject.create(projectBody)
    })

    it('should return the saved project as a POJO', () => {
      expect(project).toEqual(expect.objectContaining(projectBody))
      expect(project.constructor).toBe(Object)
      expect(project.orgId).toBe(constants.ORG_ID)
    })
  })
})

