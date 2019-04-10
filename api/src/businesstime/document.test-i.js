import BusinessDocument from './document'
import ProjectFactory from '../db/__testSetup__/factories/project'
import DocumentFactory from '../db/__testSetup__/factories/document'
import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'
import constants from '../db/__testSetup__/constants'

describe('BusinessDocument', () => {
  let factoryProject

  beforeAll(async () => {
    await initializeTestDb()
    const factoryProjects = await ProjectFactory.createMany(1)
    factoryProject = factoryProjects[0]
  })

  describe('#createForProject', () => {
    const documentBody = {
      name: 'test-document',
      orgId: constants.ORG_ID
    }
    let document

    beforeAll(async () => {
      document = await BusinessDocument.createForProject(factoryProject.id, {
        ...documentBody,
        projectId: factoryProject.id
      })
    })

    it('should return the saved document as a POJO', () => {
      expect(document).toEqual(expect.objectContaining(documentBody))
      expect(document.constructor).toBe(Object)
      expect(document.orgId).toBe(constants.ORG_ID)
    })

    describe('when the parent project does not exist', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessDocument.createForProject(0, { ...documentBody })
        ).rejects.toThrow()
      })
    })
  })

  describe('#updateByIdForProject', () => {
    let factoryDocument
    let orgId
    let projectId

    const updateBody = {
      name: 'an-updated-name'
    }

    beforeAll(async () => {
      const factoryDocuments = await DocumentFactory.createMany(1, { projectId: factoryProject.id })
      factoryDocument = factoryDocuments[0]
      orgId = factoryDocument.orgId
      projectId = factoryDocument.projectId
    })

    describe('when the target document is found', () => {
      let updatedDocument

      beforeAll(async () => {
        updatedDocument = await BusinessDocument.updateByIdForProject(
          factoryDocument.id,
          factoryProject.id,
          orgId,
          {
            ...updateBody,
            projectId
          }
        )
      })

      it('should return a POJO with updated body fields', () => {
        expect(updatedDocument).toEqual(expect.objectContaining(updateBody))
        expect(updatedDocument.constructor).toBe(Object)
      })
    })

    describe('when the target document is not found', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessDocument.updateByIdForProject(0, projectId, orgId, updateBody)
        ).rejects.toThrow()
      })
    })

    describe('when the target project is not found', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessDocument.updateByIdForProject(factoryDocument.id, 0, orgId, updateBody)
        ).rejects.toThrow()
      })
    })

    describe('when the target document does not belong to the organization', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessDocument.updateByIdForProject(factoryDocument.id, projectId, 0, updateBody)
        ).rejects.toThrow()
      })
    })
  })

  describe('document fetching', () => {
    let factoryDocuments

    beforeAll(async () => {
      await clearDb()
      factoryDocuments = await DocumentFactory.createMany(5, { projectId: factoryProject.id })
      await DocumentFactory.createMany(2, {
        projectId: factoryProject.id,
        orgId: constants.ORG_2_ID
      })
      await DocumentFactory.createMany(2, {
        projectId: 0,
        orgId: constants.ORG_ID
      })
    })

    describe('#findAllForProject', () => {
      let documents

      beforeAll(async () => {
        documents = await BusinessDocument.findAllForProject(factoryProject.id, constants.ORG_ID)
      })

      it('should return all documents from passed in project and org', () => {
        expect(documents.length).toEqual(5)
      })

      it('should return documents as POJOs', () => {
        for (const document of documents) {
          expect(document.password).toBe(undefined)
          expect(document.constructor).toBe(Object)
          expect(document.orgId).toBe(constants.ORG_ID)
        }
      })
    })

    describe('#findByIdForProject', () => {
      let targetDocumentId
      let document

      describe('when the target document has the passed in orgId and projectId', () => {
        beforeAll(async () => {
          targetDocumentId = factoryDocuments[0].id
          document = await BusinessDocument.findByIdForProject(
            targetDocumentId,
            factoryProject.id,
            constants.ORG_ID
          )
        })

        it('should return a document as POJO', () => {
          expect(document.id).toBe(targetDocumentId)
          expect(document.constructor).toBe(Object)
          expect(document.orgId).toBe(constants.ORG_ID)
        })
      })

      describe('when the target document does not have the passed in orgId', () => {
        beforeAll(async () => {
          targetDocumentId = factoryDocuments[0].id
          document = await BusinessDocument.findByIdForProject(
            targetDocumentId,
            factoryProject.id,
            constants.ORG_ID_2
          )
        })

        it('should return null', () => {
          expect(document).toBe(null)
        })
      })

      describe('when the target document does not have the passed in projectId', () => {
        beforeAll(async () => {
          targetDocumentId = factoryDocuments[0].id
          document = await BusinessDocument.findByIdForProject(
            targetDocumentId,
            0,
            constants.ORG_ID
          )
        })

        it('should return null', () => {
          expect(document).toBe(null)
        })
      })
    })
  })

  describe('#deleteByIdForProject', () => {
    let factoryDocument

    beforeAll(async () => {
      const factoryDocuments = await DocumentFactory.createMany(1, { projectId: factoryProject.id })
      factoryDocument = factoryDocuments[0]
    })

    it('should not throw an error if the target document is found', async () => {
      await expect(
        BusinessDocument.deleteByIdForProject(
          factoryDocument.id,
          factoryProject.id,
          constants.ORG_ID
        )
      ).resolves.toEqual(undefined)
    })

    it('should throw an error if the target document is not found', async () => {
      await expect(
        BusinessDocument.deleteByIdForProject(0, factoryProject.id, constants.ORG_ID)
      ).rejects.toThrow()
    })

    it('should throw an error if the document does not have the passed in projectId', async () => {
      await expect(
        BusinessDocument.deleteByIdForProject(factoryDocument.id, 0, constants.ORG_ID)
      ).rejects.toThrow()
    })

    it('should throw an error if the document does not have the passed in orgId', async () => {
      await expect(
        BusinessDocument.deleteByIdForProject(
          factoryDocument.id,
          factoryProject.id,
          constants.ORG_ID_2
        )
      ).rejects.toThrow()
    })
  })
})
