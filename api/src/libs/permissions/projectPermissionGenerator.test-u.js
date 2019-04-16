import projectPermissionGenerator from './projectPermissionGenerator'
import RESOURCE_TYPES from '../../constants/resourceTypes'
import ACTIONS from '../../constants/actions'

describe('ProjectPermissionGenerator', () => {
  it('should export a function', () => {
    expect(typeof projectPermissionGenerator).toBe('function')
  })

  describe('given a project', () => {
    let project
    let permissions
    beforeAll(() => {
      project = {
        id: 1,
        orgId: 2,
        name: 'test',
        description: ''
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
})