const sharpResize = jest.fn()
const sharpToFormat = jest.fn()
const sharpToBuffer = jest.fn()
const sharpMetadata = jest.fn(() => {
  return {
    width: 2,
    height: 2
  }
})
const sharpObject = {
  resize: sharpResize,
  toFormat: sharpToFormat,
  toBuffer: sharpToBuffer,
  metadata: sharpMetadata
}
sharpResize.mockImplementation(() => sharpObject);
sharpToFormat.mockImplementation(() => sharpObject);
sharpToBuffer.mockImplementation(() => sharpObject);

const sharp = jest.fn(() => sharpObject)
sharp.cache = jest.fn()
sharp.concurrency = jest.fn()

export default sharp
