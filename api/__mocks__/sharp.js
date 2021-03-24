const sharpResize = jest.fn()
const sharpToFormat = jest.fn()
const sharpToBuffer = jest.fn()
const sharpToFile = jest.fn()
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
  metadata: sharpMetadata,
  toFile: sharpToFile
}
sharpResize.mockImplementation(() => sharpObject)
sharpToFormat.mockImplementation(() => sharpObject)
sharpToBuffer.mockImplementation(() => sharpObject)
sharpToFile.mockImplementation(() => sharpObject)

const clearAllMocks = function() {
  sharp.mockClear()
  sharpResize.mockClear()
  sharpToFormat.mockClear()
  sharpToBuffer.mockClear()
  sharpToFile.mockClear()
  sharpMetadata.mockClear()
}

const sharp = jest.fn(() => sharpObject)
sharp.cache = jest.fn()
sharp.concurrency = jest.fn()
sharp.clearAllMocks = clearAllMocks

export default sharp

