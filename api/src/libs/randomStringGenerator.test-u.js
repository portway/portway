import rsg from './randomStringGenerator'

describe('randomStringGenerator', () => {
  let size
  let randomString
  beforeAll(async () => {
    size = 15
    randomString = await rsg(size)
  })

  it('should generate a string', () => {
    expect(typeof randomString).toBe('string')
  })

  it('should be greater than the specified byte size', () => {
    expect(randomString.length).toBeGreaterThan(size)
  })
})

