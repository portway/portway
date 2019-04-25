import resourceToProject from './resourceToProject'
import resourceTypes from '../constants/resourceTypes'
import BusinessDocument from '../businesstime/document'
import BusinessProject from '../businesstime/project'
import ACTIONS from '../constants/actions'

jest.mock('../businesstime/document')
jest.mock('../businesstime/project')

describe('resourceToProject', () => {
  describe('takes a project action', () => {
    let returnedProject
    beforeAll(async () => {
      jest.clearAllMocks()
      const requestedAction = {
        resourceType: resourceTypes.PROJECT,
        action: ACTIONS.READ,
        data: {
          id: 1234
        }
      }
      returnedProject = await resourceToProject(requestedAction, 1)
    })

    it('should return a project', () => {
      expect(typeof returnedProject).toBe('object')
    })

    it('should look up the project once', () => {
      expect(BusinessProject.findById.mock.calls.length).toBe(1)
    })

    it('should not look up a document', () => {
      expect(BusinessDocument.findParentProjectByDocumentId.mock.calls.length).toBe(0)
    })
  })

  describe('takes any action with a project id', () => {
    let returnedProject
    beforeAll(async () => {
      jest.clearAllMocks()
      const requestedAction = {
        resourceType: resourceTypes.FIELD,
        action: ACTIONS.READ,
        data: {
          projectId: 1234
        }
      }
      returnedProject = await resourceToProject(requestedAction, 1)
    })

    it('should return a project', () => {
      expect(typeof returnedProject).toBe('object')
    })

    it('should look up the project once', () => {
      expect(BusinessProject.findById.mock.calls.length).toBe(1)
    })

    it('should not look up a document', () => {
      expect(BusinessDocument.findParentProjectByDocumentId.mock.calls.length).toBe(0)
    })
  })

  describe('takes an action with a document id', () => {
    let returnedProject
    beforeAll(async () => {
      jest.clearAllMocks()
      const requestedAction = {
        resourceType: resourceTypes.DOCUMENT,
        action: ACTIONS.READ,
        data: {
          documentId: 1234
        }
      }
      returnedProject = await resourceToProject(requestedAction, 1)
    })

    it('should return a project', () => {
      expect(typeof returnedProject).toBe('object')
    })

    it('should look up the project from the document', () => {
      expect(BusinessDocument.findParentProjectByDocumentId.mock.calls.length).toBe(1)
    })

    it('should not look up a business project', () => {
      expect(BusinessProject.findById.mock.calls.length).toBe(0)
    })
  })
})