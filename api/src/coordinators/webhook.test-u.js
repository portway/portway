
import axios from 'axios'
import webhookCoordinator from './webhook'

import BusinessDocument from '../businesstime/document'
import BusinessWebhook from '../businesstime/webhook'
import BusinessWebhookDelivery from '../businesstime/webhookDelivery'

import logger from '../integrators/logger'
import { LOG_LEVELS } from '../constants/logging'
import { HOOK_TYPES } from '../constants/hooks'

jest.mock('axios')
jest.mock('../businesstime/document')
jest.mock('../businesstime/webhook')
jest.mock('../businesstime/webhookDelivery')

describe('webhookCoordinator', () => {
  const docId = 12
  const orgId = 444
  const projectId = 23

  beforeAll(() => {
    BusinessWebhook.findAllByProjectId.mockReturnValue([{
      orgId,
      projectId,
      active: true
    }])
  })

  describe('sendPublishWebhook', () => {
    beforeAll(async () => {
      BusinessDocument.findByIdWithPublishedFields.mockReturnValueOnce({
        projectId,
        id: docId,
        orgId
      })
      await webhookCoordinator.sendPublishWebhook(docId, orgId)
    })

    it('should call BusinessDocument.findByIdWithPublishedFields', () => {
      expect(BusinessDocument.findByIdWithPublishedFields.mock.calls.length).toBe(1)
      expect(BusinessDocument.findByIdWithPublishedFields.mock.calls[0][0]).toEqual(docId)
      expect(BusinessDocument.findByIdWithPublishedFields.mock.calls[0][1]).toEqual(orgId)
    })

    it('should call BusinessWebhook.findAllByProjectId', () => {
      expect(BusinessWebhook.findAllByProjectId.mock.calls.length).toBe(1)
      expect(BusinessWebhook.findAllByProjectId.mock.calls[0][0]).toEqual(projectId)
      expect(BusinessWebhook.findAllByProjectId.mock.calls[0][1]).toEqual(orgId)
    })

    it('should call axios.post', () => {
      expect(axios.post.mock.calls.length).toBe(1)
    })

    it('should call BusinessWebhookDelivery.create', () => {
      expect(BusinessWebhookDelivery.create.mock.calls.length).toBe(1)
    })
  })

  describe('sendUnpublishWebhook', () => {
    beforeAll(async () => {
      BusinessWebhook.findAllByProjectId.mockClear()
      BusinessWebhookDelivery.create.mockClear()
      axios.post.mockClear()

      BusinessDocument.findByIdWithFields.mockReturnValueOnce({
        projectId,
        orgId,
        id: docId
      })
      await webhookCoordinator.sendUnpublishWebhook(docId, orgId)
    })

    it('should call BusinessDocument.findByIdWithFields', () => {
      expect(BusinessDocument.findByIdWithFields.mock.calls.length).toBe(1)
      expect(BusinessDocument.findByIdWithFields.mock.calls[0][0]).toEqual(docId)
      expect(BusinessDocument.findByIdWithFields.mock.calls[0][1]).toEqual(orgId)
    })

    it('should call BusinessWebhook.findAllByProjectId', () => {
      expect(BusinessWebhook.findAllByProjectId.mock.calls.length).toBe(1)
      expect(BusinessWebhook.findAllByProjectId.mock.calls[0][0]).toEqual(projectId)
      expect(BusinessWebhook.findAllByProjectId.mock.calls[0][1]).toEqual(orgId)
    })

    it('should call axios.post', () => {
      expect(axios.post.mock.calls.length).toBe(1)
    })

    it('should call BusinessWebhookDelivery.create', () => {
      expect(BusinessWebhookDelivery.create.mock.calls.length).toBe(1)
    })
  })

  afterAll(() => {
    BusinessWebhook.findAllByProjectId.mockRestore()
  })
})