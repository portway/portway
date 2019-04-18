import BusinessProjectToken from './projecttoken'
import ProjectFactory from '../db/__testSetup__/factories/project'
import TokenFactory from '../db/__testSetup__/factories/token'
import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'
import constants from '../db/__testSetup__/constants'

describe('BusinessProjectUser', () => {
  beforeAll(async () => {
    await initializeTestDb()
  })

  describe('#create', () => {
    let token
    let tokenBody
    beforeAll(async () => {
      const project = (await ProjectFactory.createMany(1, {
        orgId: constants.ORG_ID
      }))[0]

      tokenBody = {
        projectId: project.id,
        roleId: 1,
        orgId: project.orgId,
        name: 'Mobile App API key',
        secret: 'whoa bro so secret'
      }

      token = await BusinessProjectToken.create(tokenBody)
    })

    it('should create a project token POJO', () => {
      // eslint-disable-next-line no-unused-vars
      const { orgId, secret, ...expectedBody } = tokenBody
      expect(token.constructor).toBe(Object)
      expect(token).toEqual(expect.objectContaining(expectedBody))
    })

    it('should not reveal the secret', () => {
      expect(token.secret).toBe(undefined)
    })
  })

  describe('findAllByProjectId', () => {
    let projectTokens
    beforeAll(async () => {
      const project = (await ProjectFactory.createMany(1, {
        orgId: constants.ORG_ID
      }))[0]

      await TokenFactory.createMany(4, {
        projectId: project.id,
        orgId: project.orgId
      })

      projectTokens = await BusinessProjectToken.findAllByProjectId(project.id, project.orgId)
    })

    it('should find 4 projects', () => {
      expect(Array.isArray(projectTokens)).toBe(true)
      expect(projectTokens.length).toBe(4)
    })

    it('should return public fields', () => {

    })
  })
})