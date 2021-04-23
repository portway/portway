import fieldCoordinator from './field'
import assetCoordinator from './assets'
import BusinessField from '../businesstime/field'
import { processMarkdownSync } from './markdown'
import { callFuncWithArgs } from '../libs/utils'
import promisifyStreamPipe from '../libs/promisifyStreamPipe'
import axios from 'axios'
import jobQueue from '../integrators/jobQueue'
import { FIELD_TYPES } from '../constants/fieldTypes'
import sharp from 'sharp'
import { getRenderedValueByType } from '../libs/fieldRenderedValue'

jest.mock('axios')
jest.mock('sharp')
jest.mock('../businesstime/field')
jest.mock('./assets')
jest.mock('./markdown')
jest.mock('../libs/utils')
jest.mock('../libs/promisifyStreamPipe')
jest.mock('../integrators/jobQueue')
jest.mock('../libs/fieldRenderedValue')

// separate these internally used functions from the mock object so we can use them for their unit tests
const addFieldToDocument = fieldCoordinator.addFieldToDocument
fieldCoordinator.addFieldToDocument = jest.fn()

describe('fieldCoordinator', () => {
  describe('#addFieldToDocument', () => {
    const documentId = 0
    const orgId = 0
    const fieldId = 999
    const body = { type: 1, value: 'some-random-text' }

    beforeAll(() => {
      fieldCoordinator.addFieldToDocument = addFieldToDocument
    })

    afterAll(() => {
      fieldCoordinator.addFieldToDocument = jest.fn()
      BusinessField.createForDocument.mockRestore()
    })

    describe('when it is a non-image field', () => {
      const mockReturnField = { id: fieldId, documentId, orgId, type: FIELD_TYPES.STRING, value: body.value }

      beforeAll(async () => {
        BusinessField.createForDocument.mockReturnValueOnce(mockReturnField)
        BusinessField.updateByIdForDocument.mockReturnValueOnce(mockReturnField)
        await fieldCoordinator.addFieldToDocument(documentId, body)
      })

      afterAll(() => {
        BusinessField.createForDocument.mockReset()
        BusinessField.updateByIdForDocument.mockReset()
      })

      it('should call BusinessField.createForDocument with the passed in documentId and body', () => {
        expect(BusinessField.createForDocument.mock.calls.length).toBe(1)
        expect(BusinessField.createForDocument.mock.calls[0][0]).toEqual(documentId)
        expect(BusinessField.createForDocument.mock.calls[0][1]).toEqual(expect.objectContaining(body))
      })

      it('should call fieldRenderedValue.getRenderedValueByType', () => {
        expect(getRenderedValueByType.mock.calls.length).toBe(1)
        expect(getRenderedValueByType.mock.calls[0][0]).toBe(mockReturnField)
        expect(getRenderedValueByType.mock.calls[0][1]).toBe(mockReturnField.value)
      })
    })

    describe('when it is an image field', () => {
      const imageBody = { type: 4, orgId }
      const file = { buffer: new Buffer('not-a-real-buffer') }
      const mockReturnImageField = { id: fieldId, documentId, orgId, type: FIELD_TYPES.IMAGE, value: body.value }

      beforeAll(async () => {
        BusinessField.createForDocument.mockReturnValueOnce(mockReturnImageField)
        BusinessField.updateByIdForDocument.mockReturnValueOnce(mockReturnImageField)
        await fieldCoordinator.addFieldToDocument(documentId, imageBody, file )
      })

      afterAll(() => {
        BusinessField.createForDocument.mockReset()
        BusinessField.updateByIdForDocument.mockReset()
      })

      it('should call assetCoordinator.addAssetForDocument', () => {
        expect(assetCoordinator.addAssetForDocument.mock.calls.length).toBe(1)
        expect(assetCoordinator.addAssetForDocument.mock.calls[0][0]).toEqual(documentId)
      })

      it('should call BusinessField.createForDocument with the passed in documentId and body with uploaded file url added', () => {
        expect(BusinessField.createForDocument.mock.calls.length).toBe(1)
        expect(BusinessField.createForDocument.mock.calls[0][0]).toEqual(documentId)
      })

      it('should call jobQueue.runImageProcessing', () => {
        expect(jobQueue.runImageProcessing.mock.calls.length).toBe(1)
        expect(jobQueue.runImageProcessing.mock.calls[0][0]).toEqual(body.value)
        expect(jobQueue.runImageProcessing.mock.calls[0][1]).toEqual(documentId)
        expect(jobQueue.runImageProcessing.mock.calls[0][2]).toEqual(fieldId)
        expect(jobQueue.runImageProcessing.mock.calls[0][3]).toEqual(orgId)
      })

      it('should call sharp() and sharp().toFile()', () => {
        expect(sharp.mock.calls.length).toBe(1)
        expect(sharp().toFile.mock.calls.length).toBe(1)
      })
    })

    describe('when it is a text field', () => {
      const mockReturnTextField = { id: fieldId, documentId, orgId, type: FIELD_TYPES.TEXT, value: body.value }
    
      describe('with an empty body', () => {
        const inputBody = {
          name: 'text-area-1',
          type: 2
        }
        beforeAll(async () => {
          processMarkdownSync.mockReset()
          BusinessField.createForDocument.mockReturnValueOnce(mockReturnTextField)
          BusinessField.updateByIdForDocument.mockReturnValueOnce(mockReturnTextField)
          await fieldCoordinator.addFieldToDocument(documentId, inputBody)
        })

        it('should call processMarkdownSync', () => {
          expect(processMarkdownSync.mock.calls.length).toBe(1)
          expect(processMarkdownSync.mock.calls[0][0]).toBe('')
        })
      })

      describe('with a body', () => {
        const inputBody = {
          name: 'text-area-1',
          type: 2,
          value: '# Markdown Header \n and pretty colors'
        }
        beforeAll(async () => {
          processMarkdownSync.mockReset()
          BusinessField.createForDocument.mockReturnValueOnce(mockReturnTextField)
          BusinessField.updateByIdForDocument.mockReturnValueOnce(mockReturnTextField)
          await fieldCoordinator.addFieldToDocument(documentId, inputBody)
        })

        it('should call processMarkdownSync', () => {
          expect(processMarkdownSync.mock.calls.length).toBe(1)
          expect(processMarkdownSync.mock.calls[0][0]).toBe(inputBody.value)
        })
      })
    })
  })

  describe('#updateDocumentField', () => {
    const fieldId = 999
    const documentId = 0
    const orgId = 111
    const body = { value: 'some-random-text' }
    const mockReturnField = { id: fieldId, documentId, orgId, type: FIELD_TYPES.TEXT, value: body.value }

    beforeAll(async () => {
      BusinessField.updateByIdForDocument.mockReset()
      BusinessField.findByIdForDocument.mockReset()
      BusinessField.setFindByIdReturnValue({ type: 2 })
      BusinessField.updateByIdForDocument.mockReturnValue(mockReturnField)
      BusinessField.findByIdForDocument.mockReturnValueOnce(mockReturnField)
      getRenderedValueByType.mockReset()
      await fieldCoordinator.updateDocumentField(fieldId, documentId, orgId, body)
    })

    afterAll(() => {
      BusinessField.updateByIdForDocument.mockReset()
    })

    it('should call BusinessField.findByIdForDocument with the passed in fieldId, documentId, orgId', () => {
      expect(BusinessField.updateByIdForDocument.mock.calls.length).toBe(2)
      expect(BusinessField.updateByIdForDocument.mock.calls[0][0]).toEqual(fieldId)
      expect(BusinessField.updateByIdForDocument.mock.calls[0][1]).toEqual(documentId)
      expect(BusinessField.updateByIdForDocument.mock.calls[0][2]).toEqual(orgId)
    })

    it('should call BusinessField.updateByIdForDocument with the passed in fieldId, documentId, orgId, and body', () => {
      expect(BusinessField.updateByIdForDocument.mock.calls.length).toBe(2)
      expect(BusinessField.updateByIdForDocument.mock.calls[0][0]).toEqual(fieldId)
      expect(BusinessField.updateByIdForDocument.mock.calls[0][1]).toEqual(documentId)
      expect(BusinessField.updateByIdForDocument.mock.calls[0][2]).toEqual(orgId)
      expect(BusinessField.updateByIdForDocument.mock.calls[0][3]).toEqual(
        expect.objectContaining(body)
      )
    })

    it('should call fieldRenderedValue.getRenderedValueByType', () => {
      expect(getRenderedValueByType.mock.calls.length).toBe(1)
      expect(getRenderedValueByType.mock.calls[0][0]).toBe(mockReturnField)
      expect(getRenderedValueByType.mock.calls[0][1]).toBe(mockReturnField.value)
    })

    describe('when it is an image field', () => {
      const imageBody = { orgId: 0, value: 'not-a-real-update-value' }
      const file = { buffer: new Buffer('not-a-real-buffer') }
      const mockReturnImageField = { ...mockReturnField, type: FIELD_TYPES.IMAGE, value: imageBody.value }

      beforeAll(async () => {
        sharp.clearAllMocks()
        BusinessField.updateByIdForDocument.mockReset()
        assetCoordinator.addAssetForDocument.mockReset()
        BusinessField.findByIdForDocument.mockReset()
        jobQueue.runImageProcessing.mockReset()
        BusinessField.updateByIdForDocument.mockReturnValue(mockReturnImageField)
        BusinessField.findByIdForDocument.mockReturnValueOnce(mockReturnImageField)
        await fieldCoordinator.updateDocumentField(fieldId, documentId, orgId, imageBody, file)
      })

      afterAll(() => {
        BusinessField.updateByIdForDocument.mockReset()
      })

      it('should call assetCoordinator addAssetForDocument', () => {
        expect(assetCoordinator.addAssetForDocument.mock.calls.length).toBe(1)
        expect(assetCoordinator.addAssetForDocument.mock.calls[0][0]).toEqual(documentId)
        expect(assetCoordinator.addAssetForDocument.mock.calls[0][1]).toEqual(orgId)
      })

      it('should call BusinessField.updateByIdForDocument with the passed in documentId and body with uploaded file url added', () => {
        expect(BusinessField.updateByIdForDocument.mock.calls.length).toBe(2)
        expect(BusinessField.updateByIdForDocument.mock.calls[0][0]).toEqual(fieldId)
        expect(BusinessField.updateByIdForDocument.mock.calls[0][1]).toEqual(documentId)
        expect(BusinessField.updateByIdForDocument.mock.calls[0][2]).toEqual(orgId)
      })

      it('should call jobQueue.runImageProcessing', () => {
        expect(jobQueue.runImageProcessing.mock.calls.length).toBe(1)
        expect(jobQueue.runImageProcessing.mock.calls[0][0]).toEqual(imageBody.value)
        expect(jobQueue.runImageProcessing.mock.calls[0][1]).toEqual(documentId)
        expect(jobQueue.runImageProcessing.mock.calls[0][2]).toEqual(fieldId)
        expect(jobQueue.runImageProcessing.mock.calls[0][3]).toEqual(orgId)
      })

      it('should call sharp() and sharp().toFile()', () => {
        expect(sharp.mock.calls.length).toBe(1)
        expect(sharp().toFile.mock.calls.length).toBe(1)
      })
    })
  })

  describe('#addImageFieldFromUrlToDocument', () => {
    const url = 'https://bonkeybong.com/picture.jpg'
    const docId = 12
    const body = {
      name: 'field'
    }

    beforeAll(async () => {
      jest.spyOn(fieldCoordinator, 'addFieldToDocument')
      axios.mockImplementation(() => {
        return { data: null }
      })
      fieldCoordinator.addFieldToDocument.mockImplementationOnce()
      callFuncWithArgs.mockReturnValueOnce({ size: 143 })
      await fieldCoordinator.addImageFieldFromUrlToDocument(docId, body, url)
    })

    it('should call promisifyStreamPipe', () => {
      expect(promisifyStreamPipe.mock.calls.length).toBe(1)
    })

    it('should call addFieldToDocument', () => {
      expect(fieldCoordinator.addFieldToDocument.mock.calls.length).toBe(1)
      expect(fieldCoordinator.addFieldToDocument.mock.calls[0][0]).toEqual(docId)
      expect(fieldCoordinator.addFieldToDocument.mock.calls[0][1]).toEqual(body)
    })

    afterAll(() => {
      fieldCoordinator.addFieldToDocument.mockRestore()
      BusinessField.findByIdForDocument.mockRestore()
      BusinessField.createForDocument.mockRestore()
    })
  })

  describe('#duplicateField', () => {
    const id = 90009
    const originalParentDocId = 90101
    const newParentDocId = 90102
    const orgId = 10000000
  
    const field = {
      id,
      type: 1,
      value: 99,
      order: 1,
      name: 'not-a-real-field-name'
    }
    beforeAll(async () => {
      jest.spyOn(fieldCoordinator, 'duplicateField')
      BusinessField.findByIdForDocument.mockReturnValueOnce(field)
      await fieldCoordinator.duplicateField(id, originalParentDocId, newParentDocId, orgId)
    })
    
    it('should call BusinessField.findByIdForDocument with the correct args', () => {
      expect(BusinessField.findByIdForDocument.mock.calls.length).toBe(1)
      expect(BusinessField.findByIdForDocument.mock.calls[0][0]).toBe(id)
      expect(BusinessField.findByIdForDocument.mock.calls[0][1]).toBe(originalParentDocId)
      expect(BusinessField.findByIdForDocument.mock.calls[0][2]).toBe(orgId)
    })

    it('should call BusinessField.createForDocument with a copy of the field', () => {
      expect(BusinessField.createForDocument.mock.calls.length).toBe(1)
      expect(BusinessField.createForDocument.mock.calls[0][0]).toBe(newParentDocId)
      expect(BusinessField.createForDocument.mock.calls[0][1].name).toBe(field.name)
      expect(BusinessField.createForDocument.mock.calls[0][1].type).toBe(field.type)
      expect(BusinessField.createForDocument.mock.calls[0][1].value).toBe(field.value)
      expect(BusinessField.createForDocument.mock.calls[0][1].order).toBe(field.order)
      expect(BusinessField.createForDocument.mock.calls[0][1].orgId).toBe(orgId)
    })
  })
})
