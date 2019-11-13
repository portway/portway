import fieldCoordinator from './field'
import BusinessField from '../businesstime/field'
import { uploadContent } from '../integrators/s3'
import { processMarkdownWithWorker } from './markdown'

jest.mock('../businesstime/field')
jest.mock('../integrators/s3')
jest.mock('./markdown')

describe('fieldCoordinator', () => {
  describe('#addFieldToDocument', () => {
    const documentId = 0
    const body = { type: 1, value: 'some-random-text', orgId: 0 }

    beforeAll(async () => {
      await fieldCoordinator.addFieldToDocument(documentId, body)
    })

    it('should call BusinessField.createForDocument with the passed in documentId and body', () => {
      expect(BusinessField.createForDocument.mock.calls.length).toBe(1)
      expect(BusinessField.createForDocument.mock.calls[0][0]).toEqual(documentId)
      expect(BusinessField.createForDocument.mock.calls[0][1]).toEqual(expect.objectContaining(body))
    })

    describe('when it is an image field', () => {
      const imageBody = { type: 4, orgId: 0 }
      const file = { buffer: new Buffer('not-a-real-buffer') }

      beforeAll(async () => {
        BusinessField.createForDocument.mockReset()
        await fieldCoordinator.addFieldToDocument(documentId, imageBody, file )
      })

      it('should call uploadContent from the s3 integrator with the passed in file', () => {
        expect(uploadContent.mock.calls.length).toBe(1)
        expect(uploadContent.mock.calls[0][2]).toEqual(file)
      })

      it('should call BusinessField.createForDocument with the passed in documentId and body with uploaded file url added', () => {
        const url = uploadContent.mock.results[0].value
        expect(BusinessField.createForDocument.mock.calls.length).toBe(1)
        expect(BusinessField.createForDocument.mock.calls[0][0]).toEqual(documentId)
        expect(BusinessField.createForDocument.mock.calls[0][1]).toEqual(expect.objectContaining({ ...imageBody, value: url }))
      })
    })

    describe('when it is a text field', () => {
      describe('with an empty body', () => {
        const inputBody = {
          name: 'text-area-1',
          type: 2
        }
        beforeAll(async () => {
          processMarkdownWithWorker.mockReset()
          await fieldCoordinator.addFieldToDocument(documentId, inputBody)
        })

        it('should call processMarkdownWithWorker', () => {
          expect(processMarkdownWithWorker.mock.calls.length).toBe(1)
          expect(processMarkdownWithWorker.mock.calls[0][0]).toBe('')
        })
      })

      describe('with a body', () => {
        const inputBody = {
          name: 'text-area-1',
          type: 2,
          value: '# Markdown Header \n and pretty colors'
        }
        beforeAll(async () => {
          processMarkdownWithWorker.mockReset()
          await fieldCoordinator.addFieldToDocument(documentId, inputBody)
        })

        it('should call processMarkdownWithWorker', () => {
          expect(processMarkdownWithWorker.mock.calls.length).toBe(1)
          expect(processMarkdownWithWorker.mock.calls[0][0]).toBe(inputBody.value)
        })
      })
    })
  })

  describe('#updateDocumentField', () => {
    const fieldId = 999
    const documentId = 0
    const orgId = 111
    const body = { value: 'some-random-text', orgId: 0 }

    beforeAll(async () => {
      BusinessField.setFindByIdReturnValue({ type: 2 })
      await fieldCoordinator.updateDocumentField(fieldId, documentId, orgId, body)
    })

    it('should call BusinessField.findByIdForDocument with the passed in fieldId, documentId, orgId', () => {
      expect(BusinessField.updateByIdForDocument.mock.calls.length).toBe(1)
      expect(BusinessField.updateByIdForDocument.mock.calls[0][0]).toEqual(fieldId)
      expect(BusinessField.updateByIdForDocument.mock.calls[0][1]).toEqual(documentId)
      expect(BusinessField.updateByIdForDocument.mock.calls[0][2]).toEqual(orgId)
    })

    it('should call BusinessField.updateByIdForDocument with the passed in fieldId, documentId, orgId, and body', () => {
      expect(BusinessField.updateByIdForDocument.mock.calls.length).toBe(1)
      expect(BusinessField.updateByIdForDocument.mock.calls[0][0]).toEqual(fieldId)
      expect(BusinessField.updateByIdForDocument.mock.calls[0][1]).toEqual(documentId)
      expect(BusinessField.updateByIdForDocument.mock.calls[0][2]).toEqual(orgId)
      expect(BusinessField.updateByIdForDocument.mock.calls[0][3]).toEqual(
        expect.objectContaining(body)
      )
    })

    describe('when it is an image field', () => {
      const imageBody = { orgId: 0 }
      const file = { buffer: new Buffer('not-a-real-buffer') }

      beforeAll(async () => {
        uploadContent.mockReset()
        BusinessField.setFindByIdReturnValue({ type: 4 })
        BusinessField.updateByIdForDocument.mockReset()
        await fieldCoordinator.updateDocumentField(fieldId, documentId, orgId, imageBody, file)
      })

      it('should call uploadContent from the s3 integrator with the passed in file', () => {
        expect(uploadContent.mock.calls.length).toBe(1)
        expect(uploadContent.mock.calls[0][2]).toEqual(file)
      })

      it('should call BusinessField.updateByIdForDocument with the passed in documentId and body with uploaded file url added', () => {
        const url = uploadContent.mock.results[0].value
        expect(BusinessField.updateByIdForDocument.mock.calls.length).toBe(1)
        expect(BusinessField.updateByIdForDocument.mock.calls[0][0]).toEqual(fieldId)
        expect(BusinessField.updateByIdForDocument.mock.calls[0][1]).toEqual(documentId)
        expect(BusinessField.updateByIdForDocument.mock.calls[0][2]).toEqual(orgId)
        expect(BusinessField.updateByIdForDocument.mock.calls[0][3]).toEqual(
          expect.objectContaining({ ...imageBody, value: url })
        )
      })
    })
  })
})
