import projectPermissionGenerator from './projectPermissionGenerator'
import RESOURCE_TYPES from '../../constants/resourceTypes'
import ACTIONS from '../../constants/actions'
import PROJECT_ACCESS_LEVELS from '../../constants/projectAccessLevels'

describe('ProjectPermissionGenerator', () => {
  it('should export a function', () => {
    expect(typeof projectPermissionGenerator).toBe('function')
  })

  describe('given a project with default read access', () => {
    let project
    let permissions
    beforeAll(() => {
      project = {
        id: 1,
        orgId: 2,
        name: 'test',
        description: '',
        accessLevel: PROJECT_ACCESS_LEVELS.READ
      }
      permissions = projectPermissionGenerator(project)
    })
    it('should return an object', () => {
      expect(typeof permissions).toBe('object')
    })
    it('should have project permissions', () => {
      expect(typeof permissions[RESOURCE_TYPES.PROJECT]).toBe('object')
    })
    it('should grant default read access', () => {
      expect(permissions[RESOURCE_TYPES.PROJECT][ACTIONS.READ]).toBe(true)
    })
  })

  describe('given a project with default write access', () => {
    let project
    let permissions
    beforeAll(() => {
      project = {
        id: 1,
        orgId: 2,
        name: 'test',
        description: '',
        accessLevel: PROJECT_ACCESS_LEVELS.WRITE
      }
      permissions = projectPermissionGenerator(project)
    })
    it('should return an object', () => {
      expect(typeof permissions).toBe('object')
    })
    it('should have project permissions', () => {
      expect(typeof permissions[RESOURCE_TYPES.PROJECT]).toBe('object')
    })
    it('should grant default update access', () => {
      expect(permissions[RESOURCE_TYPES.PROJECT][ACTIONS.UPDATE]).toBe(true)
    })
  })

  describe('given a project with no default access', () => {
    let project
    let permissions
    beforeAll(() => {
      project = {
        id: 1,
        orgId: 2,
        name: 'test',
        description: '',
        accessLevel: null
      }
      permissions = projectPermissionGenerator(project)
    })
    it('should return an empty object', () => {
      expect(typeof permissions).toBe('object')
      expect(permissions).toEqual({})
    })
  })
})