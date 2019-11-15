import { processMarkdownSync, processMarkdownWithWorker } from './markdown'
import md from 'markdown-it'
import workerFactory from '../libs/workers/workerFactory'
import markdownProcessor from '../libs/markdownProcessor'

jest.mock('markdown-it')
jest.mock('../libs/workers/workerFactory')
jest.mock('../libs/markdownProcessor')

describe('markdownCoordinator', () => {
  describe('#processMarkdownSync', () => {
    let mdInstance
    const mdString = '# string'

    beforeAll(() => {
      processMarkdownSync(mdString)
      mdInstance = md.mock.instances[0]
    })

    it('should create a markdown-it instance', () => {
      expect(md).toHaveBeenCalledTimes(1)
    })

    it('should call md.parse', () => {
      expect(mdInstance.parse.mock.calls.length).toBe(1)
      expect(mdInstance.parse.mock.calls[0][0]).toEqual(mdString)
    })

    it('should call markdownProcessor', () => {
      expect(markdownProcessor.mock.calls.length).toBe(1)
    })
  })

  describe('#processMarkdownWithWorker', () => {
    const mdString = '## header 2 \n'
    beforeAll(async () => {
      await processMarkdownWithWorker(mdString)
    })

    it('should create a markdown worker', () => {
      expect(workerFactory.mock.calls.length).toBe(1)
    })

    it('should call the markdown worker with the raw markdown', () => {
      const markdownWorkerMock = workerFactory.mock.results[0].value
      expect(markdownWorkerMock.mock.calls.length).toBe(1)
      expect(markdownWorkerMock.mock.calls[0][0]).toEqual(mdString)
    })
  })
})