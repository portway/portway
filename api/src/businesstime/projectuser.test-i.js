import BusinessProjectUser from './projectuser'
import ProjectFactory from '../db/__testSetup__/factories/project'
import UserFactory from '../db/__testSetup__/factories/user'
import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'
import constants from '../db/__testSetup__/constants'

describe('BusinessProjectUser', () => {
  beforeAll(async () => {
    await initializeTestDb()
  })

  describe('#create', () => {
    let user
    let project
    let projectUserBody
    let projectUser

    beforeAll(async () => {
      project = await ProjectFactory.createMany(1, { orgId: constants.ORG_ID })[0]
      user = await UserFactory.createMany(1, { orgId: constants.ORG_ID })[0]

      projectUserBody = {
        orgId: constants.ORG_ID,
        userId: user.id,
        projectId: project.id
      }

      projectUser = await BusinessProjectUser.create(projectUserBody)
    })

    it('should create a project user assignment', () => {
      expect(projectUser).toEqual(expect.objectContaining(projectUserBody))
      expect(projectUser.constructor).toBe(Object)
    })
  })

  // describe('#findAllByProjectId', () => {
  //   const projectBody = { name: 'test-project', orgId: constants.ORG_ID }
  //   let project

  //   beforeAll(async () => {
  //     projectuser = await BusinessProject.create(projectBody)
  //   })

  //   it('should return the saved project as a POJO', () => {
  //     expect(project).toEqual(expect.objectContaining(projectBody))
  //     expect(project.constructor).toBe(Object)
  //     expect(project.orgId).toBe(constants.ORG_ID)
  //   })
  // })
})

