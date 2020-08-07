const fs = jest.genMockFromModule('fs')

fs.promises = {
  mkdir: jest.fn(),
  writeFile: jest.fn(),
  createReadStream: jest.fn(),
  unlink: jest.fn()
}

module.exports = fs
