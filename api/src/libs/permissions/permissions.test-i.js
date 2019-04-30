import permissions from './permissions'
import ProjectFactory from '../../db/__testSetup__/factories/project'
import UserFactory from '../../db/__testSetup__/factories/user'
import { ORGANIZATION_ROLE_IDS, PROJECT_ROLE_IDS } from '../../constants/roles'
import resourceType from '../../constants/resourceTypes'
import ACTIONS from '../../constants/actions'
import initializeTestDb from '../../db/__testSetup__/initializeTestDb'
import { getDb } from '../../db/dbConnector'
import BusinessProjectUser from '../../businesstime/projectuser'
import RESOURCE_TYPES from '../../constants/resourceTypes'

describe('Permissions', () => {
  beforeAll(async () => {
    await initializeTestDb()
  })

  describe('function', () => {
    let requestorInfo
    let project
    beforeAll(async () => {
      const user = (await UserFactory.createMany(1, { orgRoleId: ORGANIZATION_ROLE_IDS.ADMIN }))[0]
      requestorInfo = {
        orgId: user.orgId,
        requestorType: RESOURCE_TYPES.USER,
        requestorId: user.id,
        orgRoleId: user.orgRoleId
      }
      project = (await ProjectFactory.createMany(1, { orgId: user.orgId }))[0]
    })

    describe('requestor has org role', () => {
      describe('and requests non-project resource', () => {
        let requestStatus
        let requestedAction
        beforeAll(async () => {
          const db = getDb()
          await db.model('ProjectUser').truncate()

          requestedAction = {
            resourceType: resourceType.USER,
            action: ACTIONS.READ,
            data: {}
          }
          requestStatus = await permissions(requestorInfo, requestedAction)
        })
        it('should return true with permission', () => {
          expect(requestStatus).toBe(true)
        })
        it('should return false without permission', async () => {
          const noPerm = { ...requestorInfo, orgRoleId: ORGANIZATION_ROLE_IDS.USER }
          const result = await permissions(noPerm, requestedAction)
          expect(result).toBe(false)
        })
      })
      describe('and requests a project resource', () => {
        let requestedAction
        let requestStatus
        beforeAll(async () => {
          requestedAction = {
            resourceType: resourceType.PROJECT,
            action: ACTIONS.CREATE,
            data: {}
          }
          requestStatus = await permissions(requestorInfo, requestedAction)
        })

        it('with permission should be true', () => {
          expect(requestStatus).toBe(true)
        })

        it('without permission should return false', async () => {
          const noPerm = { ...requestorInfo, orgRoleId: ORGANIZATION_ROLE_IDS.USER }
          const result = await permissions(noPerm, requestedAction)
          expect(result).toBe(false)
        })
      })
    })

    describe('requestor has project role', () => {
      let requestedAction
      beforeAll(async () => {
        requestedAction = {
          resourceType: resourceType.PROJECT,
          action: ACTIONS.DELETE,
          data: {
            id: project.id
          }
        }
      })
      describe('with project permission', () => {
        let requestStatus
        beforeAll(async () => {
          const db = getDb()
          await db.model('ProjectUser').truncate()
          await BusinessProjectUser.create({
            orgId: project.orgId,
            projectId: project.id,
            userId: requestorInfo.requestorId,
            roleId: PROJECT_ROLE_IDS.ADMIN
          })
          requestStatus = await permissions(requestorInfo, requestedAction)
        })
        it('should return true', () => {
          expect(requestStatus).toBe(true)
        })
      })
      describe('without project permission', () => {
        let requestStatus
        beforeAll(async () => {
          const db = getDb()
          await db.model('ProjectUser').truncate()
          await BusinessProjectUser.create({
            orgId: project.orgId,
            projectId: project.id,
            userId: requestorInfo.requestorId,
            roleId: PROJECT_ROLE_IDS.CONTRIBUTOR
          })
          requestStatus = await permissions(requestorInfo, requestedAction)
        })
        it('should return false', () => {
          expect(requestStatus).toBe(false)
        })
      })
    })

    describe('project token requestor', () => {
      let requestorInfo
      beforeAll(() => {
        requestorInfo = {
          orgId: project.orgId,
          requestorType: RESOURCE_TYPES.PROJECT_TOKEN,
          requestorId: 1234,
          roleId: PROJECT_ROLE_IDS.READER,
          projectId: project.id
        }
      })

      describe('requests a project resource', () => {
        describe('with project access', () => {
          let hasPermission

          beforeAll(async () => {
            const requestedAction = {
              resourceType: RESOURCE_TYPES.PROJECT,
              action: ACTIONS.READ,
              data: {
                id: project.id
              }
            }
            hasPermission = await permissions(requestorInfo, requestedAction)
          })

          it('should return true', () => {
            expect(hasPermission).toBe(true)
          })
        })
        describe('for a different project', () => {
          let hasPermission
          beforeAll(async () => {
            const anotherProject = (await ProjectFactory.createMany(1, {
              orgId: project.orgId
            }))[0]
            const requestedAction = {
              resourceType: RESOURCE_TYPES.PROJECT,
              action: ACTIONS.READ,
              data: {
                id: anotherProject.id
              }
            }
            hasPermission = await permissions(requestorInfo, requestedAction)
          })

          it('should return false', () => {
            expect(hasPermission).toBe(false)
          })
        })
      })
    })
  })
})