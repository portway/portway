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

      beforeAll(async () => {
        webhooks = await BusinessWebhook.findAllByProjectId(projectId1, constants.ORG_ID)
      })

      it('should return all webhooks in project', () => {
        expect(webhooks.length).toEqual(5)
      })

      it('should return projects as POJOs', () => {
        for (const webhook of webhooks) {
          expect(webhook.constructor).toBe(Object)
          expect(Object.keys(webhook)).toEqual(expect.arrayContaining(PUBLIC_FIELDS))
        }
      })
    })

    describe('#findById', () => {
      let webhook
      let webhookId

      describe('when the target webhook has the passed in orgId', () => {
        beforeAll(async () => {
          webhookId = factoryWebhooks[0].id
          webhook = await BusinessWebhook.findById(webhookId, constants.ORG_ID)
        })

        it('should return a webhook as a POJO', () => {
          expect(webhook.id).toBe(webhookId)
          expect(webhook.constructor).toBe(Object)
          expect(Object.keys(webhook)).toEqual(expect.arrayContaining(PUBLIC_FIELDS))
        })
      })

      describe('when the target webhook does not have the passed in orgId', () => {
        beforeAll(async () => {
          webhook = await BusinessWebhook.findById(webhookId, constants.ORG_ID_2)
        })

        it('should return null', () => {
          expect(webhook).toBe(null)
        })
      })
    })
  })

  describe('#deleteById', () => {
    let factoryWebhook

    beforeAll(async () => {
      const factoryWebhooks = await WebhookFactory.createMany(1)
      factoryWebhook = factoryWebhooks[0]
    })

    it('should not throw an error if the target webhook is found', async () => {
      await expect(BusinessWebhook.deleteById(factoryWebhook.id, factoryWebhook.orgId)).resolves.toEqual(undefined)
    })

    it('should throw an error if the target webhook is not found', async () => {
      await expect(BusinessWebhook.deleteById(0)).rejects.toThrow()
    })
  })

})