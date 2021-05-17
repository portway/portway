import imageProcessingCoordinator from './imageProcessing'
import { uploadBuffer } from '../integrators/s3'
import axios from 'axios'
import sharp from '../../__mocks__/sharp'
import portwayAPI from '../integrators/portwayAPI'

jest.mock('../integrators/s3')
jest.mock('axios')
jest.mock('sharp')
jest.mock('../libs/utils')
jest.mock('../integrators/portwayAPI')

describe('imageProcessingCoordinator', () => {
  describe('#createImageAlternatives', () => {
    const documentId = 111111
    const orgId = 222222
    const fieldId = 333333
    const fileUrl = 'not-a-real-s3-file-url.jpg'
    const location = 'not-a-real-location'
    const resp = { data: 'not-real-data' }
    let result

    beforeAll(async () => {
      axios.mockReturnValueOnce(resp)
      uploadBuffer.mockReturnValue({ Location: location })

      result = await imageProcessingCoordinator.createImageAlternatives(fileUrl, documentId, fieldId, orgId)
    })

    it('should call axios() with the correct args', () => {
      expect(axios.mock.calls.length).toBe(1)
      expect(axios.mock.calls[0][0]).toEqual({
        url: fileUrl, responseType: 'stream', method: 'get'
      })
    })

    it('should call sharp() for each conversion type', () => {
      expect(sharp.mock.calls.length).toBe(4)
    })

    it('should call toFormat on the sharp object 2 times', () => {
      const sharpObject = sharp.mock.results[0].value
      expect(sharpObject.toFormat.mock.calls.length).toBe(2)
    })

    it('should call resize on the sharp object 2 times', () => {
      const sharpObject = sharp.mock.results[0].value
      expect(sharpObject.resize.mock.calls.length).toBe(2)
    })

    it('should call toBuffer on the sharp object 3 times', () => {
      const sharpObject = sharp.mock.results[0].value
      expect(sharpObject.toBuffer.mock.calls.length).toBe(3)
    })

    it('should call s3Integrator.uploadBuffer 3 times, once for each format', () => {
      expect(uploadBuffer.mock.calls.length).toBe(3)
    })

    it('should call portwayAPI.updateFieldFormats', () => {
      expect(portwayAPI.updateFieldFormats.mock.calls.length).toBe(1)
      expect(portwayAPI.updateFieldFormats.mock.calls[0][0]).toBe(documentId)
      expect(portwayAPI.updateFieldFormats.mock.calls[0][1]).toBe(fieldId)
      expect(portwayAPI.updateFieldFormats.mock.calls[0][2]).toBe(orgId)
      expect(portwayAPI.updateFieldFormats.mock.calls[0][3]).toEqual({
        original: {
          full: fileUrl,
          half: location,
          mimeType: 'image/jpeg'
        },
        webp: {
          full: location,
          half: location,
          mimeType: 'image/webp'
        }
      })
    })
  })
})