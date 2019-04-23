import { createProjectToken } from './projectToken'
import randomStringGenerator from '../libs/randomStringGenerator'
import tokenGenerator from '../integrators/token'
import BusinessProjectToken from '../businesstime/projecttoken'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'

jest.mock('../businesstime/projecttoken')
jest.mock('../integrators/token')
jest.mock('../libs/randomStringGenerator')

describe('projectToken coordinator', () => {
  const name = 'Project Token Name'
  const projectId = 1
  const roleId = 1

  describe('#createProjectToken', () => {
    let token

    beforeAll(async () => {
      token = await createProjectToken({ name, projectId, roleId }, 1)
    })

    it('should call BusinessProjectToken.create', () => {
      expect(BusinessProjectToken.create.mock.calls.length).toBe(1)
      expect(BusinessProjectToken.create.mock.calls[0][0].secret).toEqual(randomStringGenerator.mock.results[0].value)
    })

    it('should call randomStringGenerator', () => {
      expect(randomStringGenerator.mock.calls.length).toBe(1)
    })

    it('should call tokenGenerator.generateProjectToken', () => {
      expect(tokenGenerator.generateProjectToken.mock.calls.length).toBe(1)
      expect(tokenGenerator.generateProjectToken.mock.calls[0][1]).toBe(randomStringGenerator.mock.results[0].value)
    })

    it('should call BusinessProjectToken.addTokenStringById', () => {
      expect(BusinessProjectToken.addTokenStringById.mock.calls.length).toBe(1)
      expect(BusinessProjectToken.addTokenStringById.mock.calls[0][1]).toBe(tokenGenerator.generateProjectToken.mock.results[0].value)
    })

    it('should return a token', () => {
      expect(Object.keys(token)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.PROJECT_TOKEN]))
    })
  })
})
