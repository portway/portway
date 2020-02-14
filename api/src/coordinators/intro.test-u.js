import introCoordinator from './intro'
import BusinessProject from '../businesstime/project'
import BusinessDocument from '../businesstime/document'
import BusinessField from '../businesstime/field'
import { getProject, getProjectDocuments, getDocumentWithFields } from '../integrators/portway'
import fieldCoordinator from './field'
import { FIELD_TYPES } from '../constants/fieldTypes'


// Begin excessive mocking
jest.mock('../businesstime/project')
jest.mock('../businesstime/document')
jest.mock('../businesstime/field')
jest.mock('../integrators/portway')
jest.mock('./field')

describe('introCoordinator', () => {
  describe('#copyIntroProjectToOrg', () => {
    const orgId = 2342
    const doc1Id = 42
    const doc2Id = 43

    beforeAll(async () => {
      getProject.mockReturnValue({ name: 'Portway Name' })
      getProjectDocuments.mockReturnValue([
        { id: doc1Id },
        { id: doc2Id }
      ])
      getDocumentWithFields.mockReturnValue({
        name: 'Test doc',
        fields: [
          { type: FIELD_TYPES.TEXT, value: '12', name: 'one' },
          { type: FIELD_TYPES.IMAGE, value: '12', name: 'two' }
        ]
      })
      await introCoordinator.copyIntroProjectToOrg(orgId)
    })

    it('should call getProject', () => {
      expect(getProject.mock.calls.length).toBe(1)
    })

    it('should call BusinessProject.create', () => {
      expect(BusinessProject.create.mock.calls.length).toBe(1)
      expect(BusinessProject.create.mock.calls[0][0].orgId).toEqual(orgId)
    })

    it('should call getProjectDocuments', () => {
      expect(getProjectDocuments.mock.calls.length).toBe(1)
    })

    it('should call getDocumentWithFields', () => {
      expect(getDocumentWithFields.mock.calls.length).toBe(2)
      expect(getDocumentWithFields.mock.calls[0][0]).toEqual(doc1Id)
      expect(getDocumentWithFields.mock.calls[1][0]).toEqual(doc2Id)
    })

    it('should call BusinessDocument.createForProject', () => {
      expect(BusinessDocument.createForProject.mock.calls.length).toBe(2)
    })

    it('should call fieldCoordinator.addImageFieldFromUrlToDocument', () => {
      expect(fieldCoordinator.addImageFieldFromUrlToDocument.mock.calls.length).toBe(2)
    })

    it('should call BusinessField.createForDocument', () => {
      expect(BusinessField.createForDocument.mock.calls.length).toBe(2)
    })
  })
})