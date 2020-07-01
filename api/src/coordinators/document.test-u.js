import documentCoordinator from './document'
import BusinessDocument from '../businesstime/document'
import BusinessField from '../businesstime/field'
import BusinessDocumentVersion from '../businesstime/documentversion'
import { slugify } from '../libs/utils'

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
  })

  describe('#deleteDocument', () => {
    beforeAll(async () => {
      await documentCoordinator.deleteDocument(docId, projectId, orgId)
    })

    it('should call BusinessField.deleteAllForDocument', () => {
      expect(BusinessField.deleteAllForDocument.mock.calls.length).toBe(1)
      expect(BusinessField.deleteAllForDocument.mock.calls[0][0]).toEqual(docId)
      expect(BusinessField.deleteAllForDocument.mock.calls[0][1]).toEqual(orgId)
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
      documentCoordinator.deleteDocument.mockRestore()
    })
  })
})