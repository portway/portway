import BusinessDocument from './document'
import ProjectFactory from '../db/__testSetup__/factories/project'
import DocumentFactory from '../db/__testSetup__/factories/document'
import DocumentVersionFactory from '../db/__testSetup__/factories/documentVersion'
import FieldFactory from '../db/__testSetup__/factories/field'
import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'
import constants from '../db/__testSetup__/constants'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import { FIELD_TYPES } from '../constants/fieldTypes'

describe('BusinessDocument', () => {
  let factoryProject

  beforeAll(async () => {
    await initializeTestDb()
    factoryProject = (await ProjectFactory.createMany(1))[0]
  })

  describe('#createForProject', () => {
    const documentBody = {
      name: 'test-document',
      orgId: constants.ORG_ID
    }
    let document

    beforeAll(async () => {
      document = await BusinessDocument.createForProject(factoryProject.id, {
        ...documentBody
      })
    })

    it('should return the saved document as a POJO', () => {
      // eslint-disable-next-line no-unused-vars
      const { orgId, ...expectedBody } = documentBody
      expect(document).toEqual(expect.objectContaining(expectedBody))
      expect(document.constructor).toBe(Object)
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
    let searchDocOne
    let searchDocTwo
    let searchTextFieldDoc
    let factoryDocuments
    let factoryProject
    const searchTextValue = 'abbacadaba'

    beforeAll(async () => {
      await clearDb()
      factoryProject = (await ProjectFactory.createMany(1))[0]
      const nonSearchDocuments = await DocumentFactory.createMany(2, { projectId: factoryProject.id, name: 'no-search' })
      searchDocOne = (await DocumentFactory.createMany(1, { projectId: factoryProject.id, name: 'razzy' }))[0]
      searchDocTwo = (await DocumentFactory.createMany(1, { projectId: factoryProject.id, name: 'pizza' }))[0]
      searchTextFieldDoc = (await DocumentFactory.createMany(1, { projectId: factoryProject.id, name: 'search-text-field-doc' }))[0]
      await FieldFactory.createMany(1, { documentId: searchTextFieldDoc.id, type: FIELD_TYPES.TEXT, value: searchTextValue })
      factoryDocuments = [...nonSearchDocuments, searchDocOne, searchDocTwo, searchTextFieldDoc]

      await DocumentFactory.createMany(2, {
        projectId: factoryProject.id,
        orgId: constants.ORG_2_ID
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
          expect(typeof document.projectId).toBe('number')
          expect(Object.keys(document)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.PROJECT_DOCUMENT]))
        }
      })

      describe('when passed a search option', () => {
        describe('when the search string matches doc names', () => {
          beforeAll(async () => {
            documents = await BusinessDocument.findAllForProject(factoryProject.id, constants.ORG_ID, { search: 'zz' })
          })

          it('should only return documents partially matching the search string', () => {
            expect(documents.length).toEqual(2)
            expect([documents[0].name, documents[1].name].sort()).toEqual([searchDocOne.name, searchDocTwo.name].sort())
          })
        })

        describe('when the search string does not match doc names or field text', () => {
          beforeAll(async () => {
            documents = await BusinessDocument.findAllForProject(factoryProject.id, constants.ORG_ID, { search: 'nothing' })
          })

          it('should not return any documents', () => {
            expect(documents.length).toEqual(0)
          })
        })

        describe('when the search string matches a text field value', () => {
          beforeAll(async () => {
            documents = await BusinessDocument.findAllForProject(factoryProject.id, constants.ORG_ID, { search: searchTextValue })
          })

          it('should only return documents partially matching the search string', () => {
            expect(documents.length).toEqual(1)
            expect(documents[0].name).toEqual(searchTextFieldDoc.name)
          })
        })
      })
    })

    describe('#findAllPublishedForProject', () => {
      let documents
      const publishedDocName = 'published-doc-name'

      beforeAll(async () => {
        const publishedVersionIdOne = 111
        const publishedVersionIdTwo = 222
        await DocumentVersionFactory.createMany(1, { id: publishedVersionIdOne, documentId: factoryDocuments[0].id, name: publishedDocName })
        await DocumentVersionFactory.createMany(1, { id: publishedVersionIdTwo, documentId: factoryDocuments[1].id, name: publishedDocName })
        await factoryDocuments[0].update({ publishedVersionId: publishedVersionIdOne })
        await factoryDocuments[1].update({ publishedVersionId: publishedVersionIdTwo })

        documents = await BusinessDocument.findAllPublishedForProject(
          factoryProject.id,
          constants.ORG_ID
        )
      })

      it('should return all published documents from passed in project and org', () => {
        expect(documents.length).toEqual(2)
      })

      it('should return documents as POJOs', () => {
        for (const document of documents) {
          expect(document.password).toBe(undefined)
          expect(document.constructor).toBe(Object)
          expect(typeof document.projectId).toBe('number')
          expect(Object.keys(document)).toEqual(
            expect.arrayContaining(resourcePublicFields[resourceTypes.PROJECT_DOCUMENT])
          )
        }
      })

      it('should return documents with published names', () => {
        for (const document of documents) {
          expect(document.name).toBe(publishedDocName)
        }
      })
    })

    describe('#findById', () => {
      let factoryDocument
      let document

      beforeAll(async () => {
        factoryProject = (await ProjectFactory.createMany(1))[0]
        factoryDocument = (await DocumentFactory.createMany(1, { projectId: factoryProject.id }))[0]
        document = await BusinessDocument.findById(factoryDocument.id, factoryDocument.orgId)
      })

      it('it should find the document', () => {
        expect(document.id).toBe(factoryDocument.id)
      })

      it('should return document as POJO', () => {
        expect(document.constructor).toBe(Object)
        expect(Object.keys(document)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.PROJECT_DOCUMENT]))
      })

      it('should not return fields', () => {
        expect(document.fields).toBe(undefined)
      })
    })

    describe('#findByIdForProject', () => {
      describe('when the target document has the passed in orgId and projectId', () => {
        let targetDocumentId
        let factoryProject
        let document

        beforeAll(async () => {
          factoryProject = (await ProjectFactory.createMany(1))[0]
          const factoryDocument = (await DocumentFactory.createMany(3, { projectId: factoryProject.id }))[0]
          targetDocumentId = factoryDocument.id
          document = await BusinessDocument.findByIdForProject(
            factoryDocument.id,
            factoryProject.id,
            factoryDocument.orgId
          )
        })

        it('should return a document as POJO', () => {
          expect(document.id).toBe(targetDocumentId)
          expect(document.constructor).toBe(Object)
          expect(document.projectId).toBe(factoryProject.id)
        })

        it('should return public fields', () => {
          expect(Object.keys(document)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.PROJECT_DOCUMENT]))
        })
      })

      describe('when the target document does not have the passed in orgId', () => {
        let targetDocumentId
        let document

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
        let targetDocumentId
        let document

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

  describe('#findPublishedByIdForProject', () => {
    let targetDocumentId
    let factoryProject
    let document
    const documentVersionName = 'published-name'

    beforeAll(async () => {
      const publishedVersionId = 777
      factoryProject = (await ProjectFactory.createMany(1))[0]
      const factoryDocument = (await DocumentFactory.createMany(3, { projectId: factoryProject.id, name: 'not-a-real-doc-name', publishedVersionId }))[0]
      await DocumentVersionFactory.createMany(1, { id: publishedVersionId, documentId: factoryDocument.id, name: documentVersionName })
      targetDocumentId = factoryDocument.id
      document = await BusinessDocument.findPublishedByIdForProject(
        factoryDocument.id,
        factoryProject.id,
        factoryDocument.orgId
      )
    })

    it('should return a document as POJO', () => {
      expect(document.id).toBe(targetDocumentId)
      expect(document.constructor).toBe(Object)
      expect(document.projectId).toBe(factoryProject.id)
    })

    it('should return public fields', () => {
      expect(Object.keys(document)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.PROJECT_DOCUMENT]))
    })

    it('should return the doc name as the published document version name', () => {
      expect(document.name).toBe(documentVersionName)
    })
  })

  describe('#deleteByIdForProject', () => {
    let factoryDocument

    beforeAll(async () => {
      await clearDb()
      factoryProject = (await ProjectFactory.createMany(1))[0]
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

  describe('#findParentProjectByDocumentId', () => {
    let factoryDocument
    let project

    beforeAll(async () => {
      await clearDb()
      const factoryProjects = await ProjectFactory.createMany(1)
      factoryProject = factoryProjects[0]
      const factoryDocuments = await DocumentFactory.createMany(1, {
        projectId: factoryProject.id
      })
      factoryDocument = factoryDocuments[0]

      project = await BusinessDocument.findParentProjectByDocumentId(
        factoryDocument.id,
        constants.ORG_ID
      )
    })

    it('should return the parent project of passed in document', () => {
      expect(project.id).toEqual(factoryProject.id)
      expect(Object.keys(project)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.PROJECT]))
    })
  })

  describe('#findByIdWithFields', () => {
    let factoryDocument
    let factoryFields
    let document

    beforeAll(async () => {
      await clearDb()
      factoryProject = (await ProjectFactory.createMany(1))[0]
      factoryDocument = (await DocumentFactory.createMany(1, { projectId: factoryProject.id }))[0]
      factoryFields = await FieldFactory.createMany(3, { type: FIELD_TYPES.NUMBER, documentId: factoryDocument.id })
    })

    describe('when the target document has the passed in orgId', () => {
      beforeAll(async () => {
        document = await BusinessDocument.findByIdWithFields(
          factoryDocument.id,
          constants.ORG_ID
        )
      })

      it('should return a document as POJO', () => {
        expect(document.id).toBe(factoryDocument.id)
        expect(document.constructor).toBe(Object)
        expect(document.projectId).toBe(factoryProject.id)
      })

      it('should include fields', () => {
        const factoryFieldIds = factoryFields.map(field => field.id)
        const docFieldIds = document.fields.map(field => field.id)
        expect(docFieldIds).toEqual(expect.arrayContaining(factoryFieldIds))
        document.fields.forEach(field => expect(field.value).toBeDefined())
      })

      it('should return public fields', () => {
        expect(Object.keys(document)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.DOCUMENT]))
      })
    })

    describe('when the target document does not have the passed in orgId', () => {
      beforeAll(async () => {
        document = await BusinessDocument.findByIdForProject(
          factoryDocument.id,
          constants.ORG_ID_2
        )
      })

      it('should return null', () => {
        expect(document).toBe(null)
      })
    })
  })

  describe('#findByIdWithPublishedFields', () => {
    let factoryDocument
    let publishedFactoryFields
    const versionId = 5
    const docVersionName = 'some-other-doc-version-name'

    beforeAll(async () => {
      factoryProject = (await ProjectFactory.createMany(1))[0]
      factoryDocument = (await DocumentFactory.createMany(1, {
        projectId: factoryProject.id,
        publishedVersionId: versionId,
        orgId: factoryProject.orgId
      }))[0]

      await DocumentVersionFactory.createMany(1, {
        documentId: factoryDocument.id,
        id: versionId,
        name: docVersionName
      })

      await FieldFactory.createMany(3, { type: 3, documentId: factoryDocument.id })
      publishedFactoryFields = await FieldFactory.createMany(2, {
        documentId: factoryDocument.id,
        versionId,
        orgId: factoryDocument.orgId
      })
    })

    describe('with a valid document id', () => {
      let document
      beforeAll(async () => {
        document = await BusinessDocument.findByIdWithPublishedFields(factoryDocument.id, factoryDocument.orgId)
      })

      it('should return the document as a POJO', () => {
        expect(document.id).toBe(factoryDocument.id)
        expect(document.constructor).toBe(Object)
      })

      it('should include fields', () => {
        const factoryFieldIds = publishedFactoryFields.map(field => field.id)
        const docFieldIds = document.fields.map(field => field.id)
        expect(docFieldIds).toEqual(expect.arrayContaining(factoryFieldIds))
        document.fields.forEach(field => expect(field.value).toBeDefined())
      })

      it('should return public fields', () => {
        expect(Object.keys(document)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.DOCUMENT]))
      })

      it('should return the published document name', () => {
        expect(document.name).toBe(docVersionName)
      })
    })

    describe('with an invalid document id', () => {
      let document
      beforeAll(async () => {
        document = await BusinessDocument.findByIdWithPublishedFields(0, factoryDocument.orgId)
      })

      it('should not return a document', () => {
        expect(document).toBeNull()
      })
    })
  })
})
