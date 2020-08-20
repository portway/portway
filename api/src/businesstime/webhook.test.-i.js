import BusinessWebhook from './webhook'
import ProjectFactory from '../db/__testSetup__/factories/project'
import WebhookFactory from '../db/__testSetup__/factories/webhook'
import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'
import constants from '../db/__testSetup__/constants'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'

describe('BusinessWebhook', () => {
  beforeAll(async () => {
    await initializeTestDb()
  })

  describe('#create', () => {
    const webhookBody = {
      active: true,
      url: 'https://example.com',
      orgId: constants.ORG_ID
    }
    let webhook

    beforeAll(async () => {
      const project = (await ProjectFactory.createMany(1))[0]
      webhookBody.projectId = project.id
      webhook = await BusinessWebhook.create(webhookBody)
    })

    it('should return the saved webhook as a POJO', () => {
      // eslint-disable-next-line no-unused-vars
      const { orgId, ...expectedBody } = webhookBody
      expect(webhook).toEqual(expect.objectContaining(expectedBody))
      expect(webhook.constructor).toBe(Object)
    })
  })

  describe('#updateById', () => {
    describe('when the target webhook is found', () => {
      let webhook
      const updateBody = { url: 'https://someotherbonkeydomain.com' }

      beforeAll(async () => {
        const factoryHook = await WebhookFactory.createMany(1)
        webhook = await BusinessWebhook.updateById(
          factoryHook[0].id,
          updateBody,
          factoryHook[0].orgId
        )
      })

      it('should return a POJO with updated body fields', () => {
        expect(webhook).toEqual(expect.objectContaining(updateBody))
        expect(webhook.constructor).toBe(Object)
      })
    })

    describe('when the target webhook is not found', () => {
      it('should throw an error', async () => {
        await expect(BusinessWebhook.updateById(0, {}, 0)).rejects.toThrow()
      })
    })
  })

  describe('webhook fetching', () => {
    let factoryWebhooks
    let projectId1 = 1
    let projectId2 = 2

    beforeAll(async () => {
      await clearDb()
      factoryWebhooks = await WebhookFactory.createMany(5, { projectId: projectId1 })
      await WebhookFactory.createMany(2, { orgId: constants.ORG_2_ID, projectId: projectId2 })
    })

    describe('#findAllByProjectId', () => {
      let webhooks
      let count

      beforeAll(async () => {
        ({ webhooks, count } = await BusinessWebhook.findAllByProjectId(constants.ORG_ID))
      })

      it('should return all paged projects in org', () => {
        expect(projects.length).toEqual(3)
      })

      it('should return projects as POJOs', () => {
        for (const project of projects) {
          expect(project.password).toBe(undefined)
          expect(project.constructor).toBe(Object)
          expect(Object.keys(project)).toEqual(expect.arrayContaining(PUBLIC_FIELDS))
        }
      })

      it('should return a project count', () => {
        expect(count).toEqual(5)
      })
    })

    describe('#findById', () => {
      let targetProjectId
      let project

      describe('when the target project has the passed in orgId', () => {
        beforeAll(async () => {
          targetProjectId = factoryProjects[0].get('id')
          project = await BusinessProject.findById(targetProjectId, constants.ORG_ID)
        })

        it('should return a project as POJO', () => {
          expect(project.id).toBe(targetProjectId)
          expect(project.constructor).toBe(Object)
          expect(Object.keys(project)).toEqual(expect.arrayContaining(PUBLIC_FIELDS))
        })
      })

      describe('when the target project does not have the passed in orgId', () => {
        beforeAll(async () => {
          targetProjectId = factoryProjects[0].get('id')
          project = await BusinessProject.findById(targetProjectId, constants.ORG_ID_2)
        })

        it('should return null', () => {
          expect(project).toBe(null)
        })
      })
    })
  })

})