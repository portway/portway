import runners from '../../constants/runners'
import workerFactory from './workerFactory'


describe('workerFactory', () => {
  // This tests a full worker thread run to ensure
  // the workerFactory is correctly passing messages with
  // the runner on the worker thread
  describe('with valid runner', () => {
    let markdownRunner
    let result

    beforeAll(async () => {
      markdownRunner = workerFactory(runners.MARKDOWN_RUNNER)
      result = await markdownRunner('# this is MARKUP \n _ok_')
    })

    it('should return a function', () => {
      expect(typeof markdownRunner).toBe('function')
    })

    it('should complete the job', () => {
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)
    })
  })

  describe('with an invalid runner', () => {
    it('should thrown an error', () => {
      expect(() => {
        workerFactory('this is not a valid runner')
      }).toThrow()
    })
  })
})