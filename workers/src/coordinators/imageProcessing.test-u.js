import imageProcessingCoordinator from './imageProcessing'
import { uploadBuffer } from '../integrators/s3'
import axios from 'axios'
import sharp from '../../__mocks__/sharp'

jest.mock('../integrators/s3')
jest.mock('axios')
jest.mock('sharp')

describe('imageProcessingCoordinator', () => {
  describe('#createImageAlternatives', () => {
    const fileUrl = 'not-a-real-s3-file-url'
    const location = 'not-a-real-location'
    const resp = { data: 'not-real-data' }
    let result

    beforeAll(async () => {
      axios.mockReturnValueOnce(resp)
      uploadBuffer.mockReturnValue({ Location: location })

      result = await imageProcessingCoordinator.createImageAlternatives(fileUrl)
    })

    it('should call axios() with the correct args', () => {
      expect(axios.mock.calls.length).toBe(1)
      expect(axios.mock.calls[0][0]).toEqual({
        url: fileUrl, responseType: 'arraybuffer', method: 'get'
      })
    })

    it('should call sharp() with the response data', () => {
      expect(sharp.mock.calls.length).toBe(1)
      expect(sharp.mock.calls[0][0]).toEqual(resp.data)
    })

    it('should call toFormat on the sharp object 4 times', () => {
      const sharpObject = sharp.mock.results[0].value
      expect(sharpObject.toFormat.mock.calls.length).toBe(4)
    })

    it('should call resize on the sharp object 2 times', () => {
      const sharpObject = sharp.mock.results[0].value
      expect(sharpObject.resize.mock.calls.length).toBe(2)
    })

    it('should call toBuffer on the sharp object 4 times', () => {
      const sharpObject = sharp.mock.results[0].value
      expect(sharpObject.toBuffer.mock.calls.length).toBe(4)
    })

    it('should call s3Integrator.uploadBuffer 4 times, once for each format', () => {
      expect(uploadBuffer.mock.calls.length).toBe(4)
    })
  })
})