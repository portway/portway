import ProjectFactory from '../db/__testSetup__/factories/project'
import DocumentFactory from '../db/__testSetup__/factories/document'
import FieldFactory from '../db/__testSetup__/factories/field'
import initializeTestDb from '../db/__testSetup__/initializeTestDb'
import documentVersionCoordinator from './documentVersion'
import { getDb } from '../db/dbConnector'

describe('documentVersion', () => {
  beforeAll(async () => {
    await initializeTestDb()
  })
  describe('#publishDocumentVersion', () => {
    let factoryDocument
    let factoryFields
    let document
    beforeAll(async () => {
      const factoryProject = (await ProjectFactory.createMany(1))[0]

      factoryDocument = (await DocumentFactory.createMany(1, { projectId: factoryProject.id, orgId: factoryProject.orgId }))[0]

      factoryFields = await FieldFactory.createMany(3, {
        docId: factoryDocument.id,
        orgId: factoryDocument.orgId
      })

      document = await documentVersionCoordinator.publishDocumentVersion(factoryDocument.id, factoryProject.id, factoryProject.orgId)
    })

    it('should create new fields', async () => {
      const db = getDb()
      const fields = await db.model('Field').findAll({
        where: { orgId: factoryDocument.orgId, versionId: document.publishedVersionId },
        raw: true
      })

      expect(fields.length).toBe(factoryFields.length)
    })

    it('should create a new document version', async () => {
      const db = getDb()
      const docVersion = await db.model('DocumentVersion').findOne({
        where: { id: document.publishedVersionId },
        raw: true
      })
      expect(docVersion.id).toBe(document.publishedVersionId)
      expect(docVersion.docId).toBe(document.id)
    })
  })
})