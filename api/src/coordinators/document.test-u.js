import documentCoordinator from './document'
import fieldCoordinator from './field'
import BusinessDocument from '../businesstime/document'
import BusinessField from '../businesstime/field'
import BusinessDocumentVersion from '../businesstime/documentversion'
import { slugify } from '../libs/utils'
import webhookCoordinator from '../coordinators/webhook'

jest.mock('./field')
jest.mock('../businesstime/document')
jest.mock('../businesstime/field')
jest.mock('../businesstime/documentversion')
jest.mock('../libs/utils')
jest.mock('../coordinators/webhook')

describe('documentCoordinator', () => {
  const docId = 12
  const projectId = 42
  const orgId = 3

  describe('#addProjectDocument', () => {
    const docBody = {
      name: 'test doc'
    }
    
    beforeAll(async () => {
      await documentCoordinator.addProjectDocument(projectId, docBody)
    })

    it('should call slugify', () => {
      expect(slugify.mock.calls.length).toBe(1)
      expect(slugify.mock.calls[0][0]).toEqual(docBody.name)
    })

    it('should call BusinessDocument.createForProject', () => {
      expect(BusinessDocument.createForProject.mock.calls.length).toBe(1)
      expect(BusinessDocument.createForProject.mock.calls[0][0]).toEqual(projectId)
    })
  })

  describe('#deleteDocument', () => {
    beforeAll(async () => {
      BusinessField.findAllForDocument.mockReturnValueOnce([{id: 23}])
      await documentCoordinator.deleteDocument(docId, projectId, orgId)
    })

    it('should call BusinessField.findAllForDocument', () => {
      expect(BusinessField.findAllForDocument.mock.calls.length).toBe(1)
      expect(BusinessField.findAllForDocument.mock.calls[0][0]).toEqual(docId)
      expect(BusinessField.findAllForDocument.mock.calls[0][1]).toEqual(orgId)
    })

    it('should call fieldCoordinator.removeDocumentField', () => {
      expect(fieldCoordinator.removeDocumentField.mock.calls.length).toBe(1)
      expect(fieldCoordinator.removeDocumentField.mock.calls[0][1]).toEqual(docId)
      expect(fieldCoordinator.removeDocumentField.mock.calls[0][2]).toEqual(orgId)
    })

    it('should call BusinessDocumentVersion.deleteAllForDocument', () => {
      expect(BusinessDocumentVersion.deleteAllForDocument.mock.calls.length).toBe(1)
      expect(BusinessDocumentVersion.deleteAllForDocument.mock.calls[0][0]).toEqual(docId)
      expect(BusinessDocumentVersion.deleteAllForDocument.mock.calls[0][1]).toEqual(orgId)
    })

    it('should call BusinessDocument.deleteByIdForProject', () => {
      expect(BusinessDocument.deleteByIdForProject.mock.calls.length).toBe(1)
      expect(BusinessDocument.deleteByIdForProject.mock.calls[0][0]).toEqual(docId)
      expect(BusinessDocument.deleteByIdForProject.mock.calls[0][1]).toEqual(projectId)
      expect(BusinessDocument.deleteByIdForProject.mock.calls[0][2]).toEqual(orgId)
    })

    it('should call webhookCoordinator.sendDocumentDeleteWebhook with the correct args', () => {
      expect(webhookCoordinator.sendDocumentDeleteWebhook.mock.calls.length).toBe(1)
      expect(webhookCoordinator.sendDocumentDeleteWebhook.mock.calls[0][0]).toBe(docId)
      expect(webhookCoordinator.sendDocumentDeleteWebhook.mock.calls[0][1]).toBe(projectId)
      expect(webhookCoordinator.sendDocumentDeleteWebhook.mock.calls[0][2]).toBe(orgId)
    })
  })

  describe('#deleteAllForProject', () => {
    const docId1 = 8232
    const docId2 = 78723
    beforeAll(async () => {
      jest.spyOn(documentCoordinator, 'deleteDocument')
      BusinessDocument.findAllForProject.mockReturnValueOnce([
        { id: docId1 },
        { id: docId2 }
      ])
      BusinessField.findAllForDocument.mockReturnValue([{ id: 23 }])

      await documentCoordinator.deleteAllForProject(projectId)
    })

    it('should call BusinessDocument.findAllForProject', () => {
      expect(BusinessDocument.findAllForProject.mock.calls.length).toBe(1)
      expect(BusinessDocument.findAllForProject.mock.calls[0][0]).toEqual(projectId)
    })

    it('should call documentCoordinator.deleteDocument', () => {
      expect(documentCoordinator.deleteDocument.mock.calls.length).toBe(2)
      expect(documentCoordinator.deleteDocument.mock.calls[0][0]).toEqual(docId1)
      expect(documentCoordinator.deleteDocument.mock.calls[1][0]).toEqual(docId2)
    })

    afterAll(() => {
      BusinessField.findAllForDocument.mockReset()
      documentCoordinator.deleteDocument.mockRestore()
    })
  })

  describe('#duplicateDocument', () => {
    const docId = 8232
  
    beforeAll(async () => {
      jest.spyOn(documentCoordinator, 'duplicateDocument')
      BusinessDocument.findAllForProject.mockReturnValueOnce([
        { id: docId1 },
        { id: docId2 }
      ])
      BusinessField.findAllForDocument.mockReturnValue([{ id: 23 }])

      await documentCoordinator.deleteAllForProject(projectId)
    })

    it('should call BusinessDocument.findAllForProject', () => {
      expect(BusinessDocument.findAllForProject.mock.calls.length).toBe(1)
      expect(BusinessDocument.findAllForProject.mock.calls[0][0]).toEqual(projectId)
    })

    it('should call documentCoordinator.deleteDocument', () => {
      expect(documentCoordinator.deleteDocument.mock.calls.length).toBe(2)
      expect(documentCoordinator.deleteDocument.mock.calls[0][0]).toEqual(docId1)
      expect(documentCoordinator.deleteDocument.mock.calls[1][0]).toEqual(docId2)
    })

    afterAll(() => {
      BusinessField.findAllForDocument.mockReset()
      documentCoordinator.deleteDocument.mockRestore()
    })
  })
})