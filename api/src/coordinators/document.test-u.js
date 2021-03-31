import documentCoordinator from './document'
import fieldCoordinator from './field'
import BusinessDocument from '../businesstime/document'
import BusinessField from '../businesstime/field'
import BusinessDocumentVersion from '../businesstime/documentversion'
import { slugify } from '../libs/utils'

jest.mock('./field')
jest.mock('../businesstime/document')
jest.mock('../businesstime/field')
jest.mock('../businesstime/documentversion')
jest.mock('../libs/utils')

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

    afterAll(async () => {
      BusinessDocument.createForProject.mockRestore()
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
    const projectId = 9898
    const orgId = 4747
    const field1Id = 6666
    const field2Id = 7777
    const dupeDocId = 888
    const name = 'not-a-real-name'
    const slug = 'not-a-real-slug'
  
    beforeAll(async () => {
      jest.spyOn(documentCoordinator, 'duplicateDocument')
      BusinessDocument.findByIdForProject.mockReturnValueOnce({
        id: docId,
        name,
        slug,
      })
      BusinessField.findAllDraftForDocument.mockReturnValueOnce([{ id: field1Id }, { id: field2Id }])
      BusinessDocument.createForProject.mockReturnValueOnce({
        id: dupeDocId
      })

      await documentCoordinator.duplicateDocument(docId, projectId, orgId)
    })

    it('should call BusinessDocument.findByIdForProject', () => {
      expect(BusinessDocument.findByIdForProject.mock.calls.length).toBe(1)
      expect(BusinessDocument.findByIdForProject.mock.calls[0][0]).toEqual(docId)
      expect(BusinessDocument.findByIdForProject.mock.calls[0][1]).toEqual(projectId)
      expect(BusinessDocument.findByIdForProject.mock.calls[0][2]).toEqual(orgId)
    })

    it('should call BusinessField.findAllDraftForDocument', () => {
      expect(BusinessField.findAllDraftForDocument.mock.calls.length).toBe(1)
      expect(BusinessField.findAllDraftForDocument.mock.calls[0][0]).toBe(docId)
      expect(BusinessField.findAllDraftForDocument.mock.calls[0][1]).toBe(orgId)
    })

    it('should call BusinessDocument.createForProject', () => {
      expect(BusinessDocument.createForProject.mock.calls.length).toBe(1)
      expect(BusinessDocument.createForProject.mock.calls[0][0]).toBe(projectId)
      expect(BusinessDocument.createForProject.mock.calls[0][1]).toBeInstanceOf(Object)
    })

    it('should call fieldCoordinator.duplicateField for each doc field', () => {
      expect(fieldCoordinator.duplicateField.mock.calls.length).toBe(2)
      expect(fieldCoordinator.duplicateField.mock.calls[0][0]).toBe(field1Id)
      expect(fieldCoordinator.duplicateField.mock.calls[0][1]).toBe(docId)
      expect(fieldCoordinator.duplicateField.mock.calls[0][2]).toBe(dupeDocId)
      expect(fieldCoordinator.duplicateField.mock.calls[0][3]).toBe(orgId)
      expect(fieldCoordinator.duplicateField.mock.calls[1][0]).toBe(field2Id)
      expect(fieldCoordinator.duplicateField.mock.calls[1][1]).toBe(docId)
      expect(fieldCoordinator.duplicateField.mock.calls[1][2]).toBe(dupeDocId)
      expect(fieldCoordinator.duplicateField.mock.calls[1][3]).toBe(orgId)
    })

    it('should call BusinessDocument.findByIdWithFields', () => {
      expect(BusinessDocument.findByIdWithFields.mock.calls.length).toBe(1)
      expect(BusinessDocument.findByIdWithFields.mock.calls[0]).toBe(dupeDocId)
      expect(BusinessDocument.findByIdWithFields.mock.calls[0]).toBe(orgId)
    })

    afterAll(() => {
      BusinessDocument.findByIdForProject.mockReset()
      BusinessField.findAllDraftForDocument.mockReset()
      BusinessDocument.createForProject.mockReset()
      documentCoordinator.duplicateDocument.mockRestore()
    })
  })
})