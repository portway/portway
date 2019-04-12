import checkRolePermissions from './checkRolePermissions'
import actions from '../../constants/actions'
import resourceTypes from '../../constants/resourceTypes'

describe('checkRolePermissions', () => {
  it('should export a function', () => {
    expect(typeof checkRolePermissions === 'function').toBe(true)
  })

  describe('with org roles', () => {
    let role
    beforeAll(() => {
      role = {
        [resourceTypes.PROJECT]: {
          [actions.LIST]: true,
          [actions.READ]: true
        }
      }
    })

    it('should throw an error for an undefined resourceType', () => {
      expect(() => {
        checkRolePermissions(role, 'not a real resource', actions.READ)
      }).toThrow()
    })

    it('should throw an error for an undefined action', () => {
      expect(() => {
        checkRolePermissions(role, resourceTypes.PROJECT, 'not a real action')
      }).toThrow()
    })

    it('should pass a role with the requested permission', () => {
      expect(checkRolePermissions(role, resourceTypes.PROJECT, actions.LIST)).toBe(true)
    })

    it('should fail a role without the requested action', () => {
      expect(checkRolePermissions(role, resourceTypes.PROJECT, actions.CREATE)).toBe(false)
    })

    it('should fail a role without the requested resource', () => {
      expect(checkRolePermissions(role, resourceTypes.DOCUMENT, actions.LIST)).toBe(false)
    })

    describe('with multiple roles', () => {
      let roles
      beforeAll(() => {
        const role2 = {
          [resourceTypes.PROJECT]: {
            [actions.LIST]: true,
            [actions.CREATE]: true
          }
        }
        roles = [role, role2]
      })
      it('should pass if both roles have permission', () => {
        expect(checkRolePermissions(roles, resourceTypes.PROJECT, actions.LIST)).toBe(true)
      })
      it('should fail if both roles do not have permission', () => {
        expect(checkRolePermissions(roles, resourceTypes.PROJECT, actions.DELETE)).toBe(false)
      })
      it('should pass if one role has permission', () => {
        expect(checkRolePermissions(roles, resourceTypes.PROJECT, actions.CREATE)).toBe(true)
      })
    })
  })
})