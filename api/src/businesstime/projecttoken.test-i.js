import BusinessProjectToken from './projecttoken'
import ProjectFactory from '../db/__testSetup__/factories/project'
import TokenFactory from '../db/__testSetup__/factories/token'
import initializeTestDb from '../db/__testSetup__/initializeTestDb'
import constants from '../db/__testSetup__/constants'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'

const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.PROJECT_TOKEN]

describe('BusinessProjectToken', () => {
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
        secret: 'whoa bro so secret',
        token: '123893284asdfakl;na;sd23802zaasdfajkls;fnma,.w323ioljlkasdjlf;dgjhk;ldefinitelyarealtoken'
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

  describe('#findAllByProjectId', () => {
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
      const token = projectTokens[2]
      expect(Object.keys(token)).toEqual(expect.arrayContaining(PUBLIC_FIELDS))
    })
  })

  describe('#updateNameById', () => {
    let updatedName
    let updatedToken
    let token
    beforeAll(async () => {
      updatedName = 'newName'
      const project = (await ProjectFactory.createMany(1, {
        orgId: constants.ORG_ID
      }))[0]

      token = (await TokenFactory.createMany(1, {
        projectId: project.id,
        orgId: project.orgId
      }))[0]

      updatedToken = await BusinessProjectToken.updateNameById(token.id, updatedName, token.orgId)
    })

    it('should return a token', () => {
      expect(Object.keys(updatedToken)).toEqual(expect.arrayContaining(PUBLIC_FIELDS))
    })

    it('should update the name', () => {
      expect(updatedToken.name).toBe(updatedName)
      expect(token.name).not.toBe(updatedToken.name)
    })
  })

  describe('#findById', () => {
    let token
    beforeAll(async () => {
      const factoryToken = (await TokenFactory.createMany(1, {
        projectId: 123,
        orgId: constants.ORG_ID
      }))[0]

      token = await BusinessProjectToken.findById(factoryToken.id, factoryToken.orgId)
    })

    it('should return public fields', () => {
      expect(Object.keys(token)).toEqual(expect.arrayContaining(PUBLIC_FIELDS))
    })

    it('should not return the secret', () => {
      expect(token.secret).toBe(undefined)
    })
  })

  describe('#findByIdUnsanitized', () => {
    let token
    let factoryToken
    beforeAll(async () => {
      factoryToken = (await TokenFactory.createMany(1, {
        projectId: 123,
        orgId: constants.ORG_ID
      }))[0]

      token = await BusinessProjectToken.findByIdUnsanitized(factoryToken.id, factoryToken.orgId)
    })

    it('should return public fields', () => {
      expect(Object.keys(token)).toEqual(expect.arrayContaining(PUBLIC_FIELDS))
    })

    it('should return the secret', () => {
      expect(token.secret).toBe(factoryToken.secret)
    })
  })

  describe('#addTokenStringById', () => {
    let updatedTokenString
    let updatedToken
    beforeAll(async () => {
      updatedTokenString = 'asdf123asdf123.23423480atotallyrealtoken'

      const token = (await TokenFactory.createMany(1, {
        projectId: 123,
        orgId: constants.ORG_ID
      }))[0]

      updatedToken = await BusinessProjectToken.addTokenStringById(token.id, updatedTokenString, token.orgId)
    })

    it('should update the token string', () => {
      expect(updatedToken.token).toBe(updatedTokenString)
    })

    it('should return public fields', () => {
      expect(Object.keys(updatedToken)).toEqual(expect.arrayContaining(PUBLIC_FIELDS))
    })

    it('should not return the secret', () => {
      expect(updatedToken.secret).toBe(undefined)
    })
  })

  describe('#deleteById', () => {
    let token
    beforeAll(async () => {
      const project = (await ProjectFactory.createMany(1, {
        orgId: constants.ORG_ID
      }))[0]

      const tokens = await TokenFactory.createMany(2, {
        projectId: project.id,
        orgId: project.orgId
      })

      token = tokens[0]
    })

    it('should delete the token', async () => {
      await expect(BusinessProjectToken.deleteById(token.id, token.orgId)).resolves.toEqual(undefined)
    })

    it('should throw an error if the token is not found', async () => {
      await expect(BusinessProjectToken.deleteById(0, token.orgId)).rejects.toThrow()
    })
  })
})