import ProjectFactory from '../db/__testSetup__/factories/project'
import DocumentFactory from '../db/__testSetup__/factories/document'
import FieldFactory from '../db/__testSetup__/factories/field'
import initializeTestDb from '../db/__testSetup__/initializeTestDb'
import documentVersionCoordinator from './documentVersion'
import { uniqueVals } from '../libs/utils'
import { getDb } from '../db/dbConnector'
import BusinessDocument from '../businesstime/document'

describe('documentVersion', () => {
  beforeAll(async () => {
    await initializeTestDb()
  })
  describe('#publishDocumentVersion', () => {
    describe('with a valid document id', () => {
      let factoryDocument
      let factoryFields
      let document
      beforeAll(async () => {
        const factoryProject = (await ProjectFactory.createMany(1))[0]

        factoryDocument = (await DocumentFactory.createMany(1, { projectId: factoryProject.id, orgId: factoryProject.orgId }))[0]

        factoryFields = await FieldFactory.createMany(3, {
          documentId: factoryDocument.id,
          orgId: factoryDocument.orgId
        })

        document = await documentVersionCoordinator.publishDocumentVersion(factoryDocument.id, factoryProject.id, factoryProject.orgId)
      })

      describe('published fields', () => {
        let fields

        beforeAll(async () => {
          const db = getDb()
          fields = await db.model('Field').findAll({
            where: { orgId: factoryDocument.orgId, versionId: document.publishedVersionId },
            raw: true
          })
        })

        it('should create new fields', async () => {
          expect(fields.length).toBe(factoryFields.length)
        })

        it('should order the new fields', async () => {
          const order = uniqueVals(fields.map(field => field.order))
          expect(order.length).toBe(factoryFields.length)
          expect(order).toEqual(expect.arrayContaining(factoryFields.map(f => f.order)))
        })
      })

      it('should create a new document version', async () => {
        const db = getDb()
        const docVersion = await db.model('DocumentVersion').findOne({
          where: { id: document.publishedVersionId },
          raw: true
        })
        expect(docVersion.id).toBe(document.publishedVersionId)
        expect(docVersion.documentId).toBe(document.id)
      })
    })
    describe('with an invalid document id', () => {
      let project
      beforeAll(async () => {
        project = (await ProjectFactory.createMany(1))[0]
      })

      it('should throw an error', async () => {
        await expect(
          documentVersionCoordinator.publishDocumentVersion(9999999, project.id, project.orgId)
        ).rejects.toThrow()
      })
    })
  })

  describe('unpublishDocument', () => {
    let factoryDocument
    let document
    beforeAll(async () => {
      const factoryProject = (await ProjectFactory.createMany(1))[0]

      factoryDocument = (await DocumentFactory.createMany(1, {
        projectId: factoryProject.id,
        orgId: factoryProject.orgId
      }))[0]

      const factoryFields = await FieldFactory.createMany(3, {
        documentId: factoryDocument.id,
        orgId: factoryDocument.orgId
      })

      await documentVersionCoordinator.publishDocumentVersion(
        factoryDocument.id,
        factoryProject.id,
        factoryProject.orgId
      )

      const populatedDoc = await BusinessDocument.findByIdWithPublishedFields(factoryDocument.id, factoryDocument.orgId)
      expect(populatedDoc.fields.length).toBe(factoryFields.length)

      document = await documentVersionCoordinator.unpublishDocument(
        factoryDocument.id,
        factoryProject.id,
        factoryProject.orgId
      )
    })

    it('should set the publishedVersionId and lastPublishedAt document fields to null', () => {
      expect(document.publishedVersionId).toBe(null)
      expect(document.lastPublishedAt).toBe(null)
    })

    it('should no longer return anything when querying for published fields', async () => {
      const populatedDoc = await BusinessDocument.findByIdWithPublishedFields(factoryDocument.id, factoryDocument.orgId)
      expect(populatedDoc.fields.length).toBe(0)
    })
  })
})