import BusinessField from './field'
import ProjectFactory from '../db/__testSetup__/factories/project'
import DocumentFactory from '../db/__testSetup__/factories/document'
import FieldFactory from '../db/__testSetup__/factories/field'
import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'
import constants from '../db/__testSetup__/constants'

describe('BusinessDocument', () => {
  let factoryProject
  let factoryDocument

  beforeAll(async () => {
    await initializeTestDb()
    const factoryProjects = await ProjectFactory.createMany(1)
    factoryProject = factoryProjects[0]
    const factoryDocuments = await DocumentFactory.createMany(1, { projectId: factoryProject.id })
    factoryDocument = factoryDocuments[0]
  })

  describe('#createForProjectDocument', () => {
    const documentBody = {
      name: 'test-field',
      orgId: constants.ORG_ID
    }
    let field

    beforeAll(async () => {
      field = await BusinessField.createForProjectDocument(factoryProject.id, factoryDocument.id, {
        ...documentBody,
        projectId: factoryProject.id,
        docId: factoryDocument.id
      })
    })

    it('should return the saved field as a POJO', () => {
      expect(field).toEqual(expect.objectContaining(documentBody))
      expect(field.constructor).toBe(Object)
      expect(field.orgId).toBe(constants.ORG_ID)
    })

    describe('when the parent document does not exist', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessField.createForProjectDocument(factoryProject.id, factoryDocument.id, {
            ...documentBody,
            projectId: factoryProject.id,
            docId: 0
          })
        ).rejects.toThrow()
      })
    })

    describe('when the passed in projectId does not match the body projectId', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessField.createForProjectDocument(factoryProject.id, factoryDocument.id, {
            ...documentBody,
            projectId: 0,
            docId: factoryDocument.id
          })
        ).rejects.toThrow()
      })
    })

    describe('when the passed in docId does not match the body docId', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessField.createForProjectDocument(factoryProject.id, factoryDocument.id, {
            ...documentBody,
            projectId: factoryProject.id,
            docId: 0
          })
        ).rejects.toThrow()
      })
    })
  })

  describe('#updateByIdForProjectDocument', () => {
    let factoryField
    let fieldId
    let orgId
    let projectId
    let docId

    const updateBody = {
      name: 'an-updated-name'
    }

    beforeAll(async () => {
      const factoryFields = await FieldFactory.createMany(1, { docId: factoryDocument.id })
      factoryField = factoryFields[0]
      fieldId = factoryField.id
      orgId = factoryField.orgId
      projectId = factoryProject.id
      docId = factoryField.docId
    })

    describe('when the target field is found', () => {
      let updatedField

      beforeAll(async () => {
        updatedField = await BusinessField.updateByIdForProjectDocument(
          factoryField.id,
          projectId,
          docId,
          orgId,
          {
            ...updateBody,
            docId
          }
        )
      })

      it('should return a POJO with updated body fields', () => {
        expect(updatedField).toEqual(expect.objectContaining(updateBody))
        expect(updatedField.constructor).toBe(Object)
      })
    })

    describe('when the target field is not found', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessField.updateByIdForProjectDocument(0, projectId, docId, orgId, updateBody)
        ).rejects.toThrow()
      })
    })

    describe('when the target document is not found', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessField.updateByIdForProjectDocument(fieldId, projectId, 0, orgId, updateBody)
        ).rejects.toThrow()
      })
    })

    describe('when the target field does not belong to the organization', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessField.updateByIdForProjectDocument(fieldId, projectId, docId, 0, updateBody)
        ).rejects.toThrow()
      })
    })

    describe('when the passed in docId does not match the body docId', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessField.updateByIdForProjectDocument(fieldId, projectId, docId, orgId, {
            ...updateBody,
            projectId,
            docId: 0
          })
        ).rejects.toThrow()
      })
    })
  })

  describe('field fetching', () => {
    let factoryFields

    beforeAll(async () => {
      await clearDb()
      factoryFields = await FieldFactory.createMany(5, { docId: factoryDocument.id })
      await DocumentFactory.createMany(2, {
        docId: factoryDocument.id,
        orgId: constants.ORG_2_ID
      })
      await DocumentFactory.createMany(2, {
        docId: 0,
        orgId: constants.ORG_ID
      })
    })

    describe('#findAllForDocument', () => {
      let fields

      beforeAll(async () => {
        fields = await BusinessField.findAllForDocument(factoryDocument.id, constants.ORG_ID)
      })

      it('should return all fields from passed in document and org', () => {
        expect(fields.length).toEqual(5)
      })

      it('should return fields as POJOs', () => {
        for (const field of fields) {
          expect(field.constructor).toBe(Object)
          expect(field.orgId).toBe(constants.ORG_ID)
        }
      })
    })

    describe('#findByIdForDocument', () => {
      let targetFieldId
      let field

      describe('when the target field has the passed in orgId and docId', () => {
        beforeAll(async () => {
          targetFieldId = factoryFields[0].id
          field = await BusinessField.findByIdForDocument(
            targetFieldId,
            factoryDocument.id,
            constants.ORG_ID
          )
        })

        it('should return a field as POJO', () => {
          expect(field.id).toBe(targetFieldId)
          expect(field.constructor).toBe(Object)
          expect(field.orgId).toBe(constants.ORG_ID)
        })
      })

      describe('when the target field does not have the passed in orgId', () => {
        beforeAll(async () => {
          targetFieldId = factoryFields[0].id
          field = await BusinessField.findByIdForDocument(
            targetFieldId,
            factoryProject.id,
            constants.ORG_ID_2
          )
        })

        it('should return null', () => {
          expect(field).toBe(null)
        })
      })

      describe('when the target field does not have the passed in projectId', () => {
        beforeAll(async () => {
          targetFieldId = factoryFields[0].id
          field = await BusinessField.findByIdForDocument(
            targetFieldId,
            0,
            constants.ORG_ID
          )
        })

        it('should return null', () => {
          expect(field).toBe(null)
        })
      })
    })
  })

  describe('#deleteByIdForDocument', () => {
    let factoryField

    beforeAll(async () => {
      const factoryFields = await FieldFactory.createMany(1, { docId: factoryDocument.id })
      factoryField = factoryFields[0]
    })

    it('should not throw an error if the target document is found', async () => {
      await expect(
        BusinessField.deleteByIdForDocument(
          factoryField.id,
          factoryDocument.id,
          constants.ORG_ID
        )
      ).resolves.toEqual(undefined)
    })

    it('should throw an error if the target field is not found', async () => {
      await expect(
        BusinessField.deleteByIdForDocument(0, factoryDocument.id, constants.ORG_ID)
      ).rejects.toThrow()
    })

    it('should throw an error if the document does not have the passed in docId', async () => {
      await expect(
        BusinessField.deleteByIdForDocument(factoryField.id, 0, constants.ORG_ID)
      ).rejects.toThrow()
    })

    it('should throw an error if the document does not have the passed in orgId', async () => {
      await expect(
        BusinessField.deleteByIdForDocument(
          factoryField.id,
          factoryDocument.id,
          constants.ORG_ID_2
        )
      ).rejects.toThrow()
    })
  })
})
