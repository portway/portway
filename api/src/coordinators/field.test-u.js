import fieldCoordinator from './field'
import BusinessField from '../businesstime/field'
import { uploadImage } from '../integrators/s3'

jest.mock('../businesstime/field')
jest.mock('../integrators/s3')

describe('fieldCoordinator', () => {
  describe('#addFieldToDocument', () => {
    const docId = 0
    const body = { type: 1, value: 'some-random-text', orgId: 0 }

    beforeAll(async () => {
      await fieldCoordinator.addFieldToDocument(docId, body)
    })

    it('should call BusinessField.createForDocument with the passed in docId and body', () => {
      expect(BusinessField.createForDocument.mock.calls.length).toBe(1)
      expect(BusinessField.createForDocument.mock.calls[0][0]).toEqual(docId)
      expect(BusinessField.createForDocument.mock.calls[0][1]).toEqual(expect.objectContaining(body))
    })

    describe('when it is an image field', () => {
      const imageBody = { type: 4, orgId: 0 }
      const file = { buffer: new Buffer('not-a-real-buffer') }

      beforeAll(async () => {
        BusinessField.createForDocument.mockReset()
        await fieldCoordinator.addFieldToDocument(docId, imageBody, file )
      })

      it('should call uploadImage from the s3 integrator with the passed in file', () => {
        expect(uploadImage.mock.calls.length).toBe(1)
        expect(uploadImage.mock.calls[0][0]).toEqual(file)
      })

      it('should call BusinessField.createForDocument with the passed in docId and body with uploaded file url added', () => {
        const url = uploadImage.mock.results[0].value
        expect(BusinessField.createForDocument.mock.calls.length).toBe(1)
        expect(BusinessField.createForDocument.mock.calls[0][0]).toEqual(docId)
        expect(BusinessField.createForDocument.mock.calls[0][1]).toEqual(expect.objectContaining({ ...imageBody, value: url }))
      })
    })
  })
})
