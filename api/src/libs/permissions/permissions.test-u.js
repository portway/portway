import { getOrganizationRole } from './permissions'

describe('getOrganizationRole', () => {
  describe('with an orgRoleId', () => {
    let orgRoles
    beforeAll(() => {
      const requestorInfo = {
        requestorId: 1,
        requestorType: 'user',
        orgId: 1,
        orgRoleId: 1
      }
      orgRoles = getOrganizationRole(requestorInfo)
    })

    it('should expose a function', () => {
      expect(typeof getOrganizationRole).toBe('function')
    })

    it('should return a role', () => {
      expect(orgRoles.length).toBe(1)
    })

    it('should return a role with permissions', () => {
      expect(Object.keys(orgRoles[0]).length).toBeGreaterThan(0)
    })
  })

  describe('without an orgRoleId', () => {
    let orgRoles
    beforeAll(() => {
      const requestorInfo = {
        requestorId: 1,
        requestorType: 'api',
        orgId: 1
      }
      orgRoles = getOrganizationRole(requestorInfo)
    })
    it('should return an array', () => {
      expect(Array.isArray(orgRoles)).toBe(true)
    })
    it('should be an empty array', () => {
      expect(orgRoles.length).toBe(0)
    })
  })

  describe('with bad requestorInfo input data', () => {
    let orgRoles
    beforeAll(async () => {
      const requestorInfo = {
        thisPropertyIsMeaningless: 'ok',
        definitelyNotanOrgId: 234
      }
      orgRoles = getOrganizationRole(requestorInfo)
    })
    it('should return an array', () => {
      expect(Array.isArray(orgRoles)).toBe(true)
    })
    it('should be an empty array', () => {
      expect(orgRoles.length).toBe(0)
    })
  })
})