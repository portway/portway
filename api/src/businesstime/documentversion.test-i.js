import BusinessDocumentVersion from './documentversion'
import ProjectFactory from '../db/__testSetup__/factories/project'
import DocumentFactory from '../db/__testSetup__/factories/document'
import initializeTestDb from '../db/__testSetup__/initializeTestDb'

describe('BusinessDocumentVersion', () => {
  let factoryDocument

  beforeAll(async () => {
    await initializeTestDb()
    const factoryProjects = await ProjectFactory.createMany(1)
    const factoryProject = factoryProjects[0]

    factoryDocument = (await DocumentFactory.createMany(1, { projectId: factoryProject.id, orgId: factoryProject.orgId }))[0]
  })

  describe('#createVersion', () => {
    let documentVersion
    beforeAll(async () => {
      documentVersion = await BusinessDocumentVersion.createVersion(factoryDocument.id, factoryDocument.name, factoryDocument.slug, factoryDocument.orgId)
    })

    it('should belong to the document', () => {
      expect(documentVersion.documentId).toBe(factoryDocument.id)
    })

    it('should belong to the org', () => {
      expect(documentVersion.orgId).toBe(factoryDocument.orgId)
    })

    it('should have a version number', () => {
      expect(typeof documentVersion.versionNumber).toBe('number')
    })

    it('should set the version to 1', () => {
      expect(documentVersion.versionNumber).toBe(1)
    })

    it('should get the passed in name', () => {
      expect(documentVersion.name).toBe(factoryDocument.name)
    })

    it('should get the passed in slug', () => {
      expect(documentVersion.slug).toBe(factoryDocument.slug)
    })

    describe('version increment', () => {
      let nextVersion
      beforeAll(async () => {
        nextVersion = await BusinessDocumentVersion.createVersion(factoryDocument.id, factoryDocument.name, factoryDocument.orgId)
      })

      it('should increment version by 1', () => {
        expect(nextVersion.versionNumber).toBe(documentVersion.versionNumber + 1)
      })
    })
  })
})