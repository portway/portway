import projectExportCoordinator from './projectExport'
import zipIntegrator from '../integrators/zip'
import BusinessDocument from '../businesstime/document'
import { FIELD_TYPES } from '../constants/fieldTypes'
import documentToMd from '../libs/documentToMd'

jest.mock('../businesstime/document')
jest.mock('../integrators/zip')
jest.mock('../libs/documentToMd')
const fs = jest.genMockFromModule('fs')
fs.promises = { mkdir: jest.fn() }

describe('projectExportCoordinator', () => {
  describe('#getProjectExportData', () => {
    const orgId = 2342727
    const projectId = 3113
    const doc1Id = 4254
    const doc2Id = 4255

    beforeAll(async () => {
      BusinessDocument.findAllForProject.mockReturnValueOnce([{ id: doc1Id }, { id: doc2Id }])
      BusinessDocument.findByIdWithFields.mockReturnValue(
        { id: doc1Id, fields: [{ name: 'one', type: FIELD_TYPES.TEXT, value: '##Header\n- 1\n- 2\n- 3\n- 4' }, { name: 'two', type: FIELD_TYPES.NUMBER, value: 5 }] }
      )
      await projectExportCoordinator.getProjectExportData(projectId, orgId)
    })

    it('should call BusinessDocument.findAllForProject', () => {
      expect(BusinessDocument.findAllForProject.mock.calls.length).toBe(1)
      expect(BusinessDocument.findAllForProject.mock.calls[0][0]).toEqual(projectId)
      expect(BusinessDocument.findAllForProject.mock.calls[0][1]).toEqual(orgId)
    })

    it('should call BusinessDocument.findAllForProject', () => {
      expect(BusinessDocument.findAllForProject.mock.calls.length).toBe(1)
      expect(BusinessDocument.findAllForProject.mock.calls[0][0]).toEqual(projectId)
      expect(BusinessDocument.findAllForProject.mock.calls[0][1]).toEqual(orgId)
    })

    it('should call documentToMd for each document', () => {
      expect(documentToMd.mock.calls.length).toBe(2)
    })

    it('should call fs.promises.mkdir', () => {
      expect(fs.mock.promises.mkdir.calls.length).ToBe(1)
    })
  })
})