import projectExportCoordinator from './projectExport'
import zipIntegrator from '../integrators/zip'
import FIELD_TYPES from '../constants/fieldTypes'
import documentToMd from '../libs/documentToMd'
import portwayAPI from '../integrators/portwayAPI'
import fs from 'fs'
import axios from 'axios'
import { promisifyStreamPipe } from '../libs/utils'
import { uploadExportZip } from '../integrators/s3'

jest.mock('../integrators/zip')
jest.mock('../libs/documentToMd')
jest.mock('fs')
jest.mock('axios')
jest.mock('../libs/utils')
jest.mock('../integrators/portwayAPI')
jest.mock('../integrators/s3')

describe('projectExportCoordinator', () => {
  describe('#getProjectExportData', () => {
    const orgId = 2342727
    const projectId = 3113
    const doc1Id = 4254
    const doc2Id = 4255
    const fileUrl = 'not-a-real-file-url'
    let result

    beforeAll(async () => {
      portwayAPI.fetchProjectDocuments.mockReturnValueOnce({ data: [{ id: doc1Id }, { id: doc2Id }] })
      portwayAPI.fetchFullDocument.mockReturnValueOnce({
        data:
        { id: doc1Id, fields: [{ name: 'one', type: FIELD_TYPES.TEXT, value: '##Header\n- 1\n- 2\n- 3\n- 4' }, { name: 'two', type: FIELD_TYPES.IMAGE, value: 'not-a-real-image-url' }] }
      })
      portwayAPI.fetchFullDocument.mockReturnValueOnce({
        data: 
        { id: doc2Id, fields: [{ name: 'one', type: FIELD_TYPES.TEXT, value: '##Header\n- 1\n- 2\n- 3\n- 4' }, { name: 'two', type: FIELD_TYPES.FILE, value: 'not-a-real-file-url' }] }
      })
      axios.mockReturnValue({ data: null })
      promisifyStreamPipe.mockReturnValue(null)
      uploadExportZip.mockReturnValue(fileUrl)
      result = await projectExportCoordinator.getProjectExportData(projectId, orgId)
    })

    it('should call portwayAPI.fetchProjectDocuments', () => {
      expect(portwayAPI.fetchProjectDocuments.mock.calls.length).toBe(1)
      expect(portwayAPI.fetchProjectDocuments.mock.calls[0][0]).toEqual(projectId)
      expect(portwayAPI.fetchProjectDocuments.mock.calls[0][1]).toEqual(orgId)
    })

    it('should call documentToMd for each document', () => {
      expect(documentToMd.mock.calls.length).toBe(2)
    })

    it('should call fs.promises.mkdir twice', () => {
      expect(fs.promises.mkdir.mock.calls.length).toBe(2)
    })

    it('should call fs.promises.writeFile to write a md file for each document in the project', () => {
      expect(fs.promises.writeFile.mock.calls.length).toBe(2)
    })

    it('should call axios() with a get request for each image or file field', () => {
      expect(axios.mock.calls.length).toBe(2)
    })

    it('should call zipIntegrator.compressDirectory once', () => {
      expect(zipIntegrator.compressDirectory.mock.calls.length).toBe(1)
    })

    it('should call uploadExportZip once', () => {
      expect(uploadExportZip.mock.calls.length).toBe(1)
    })

    it('should return the s3 file url', () => {
      expect(result).toBe(fileUrl)
    })
  })
})