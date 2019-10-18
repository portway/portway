import BusinessField from './field'
import ProjectFactory from '../db/__testSetup__/factories/project'
import DocumentFactory from '../db/__testSetup__/factories/document'
import FieldFactory from '../db/__testSetup__/factories/field'
import DocumentVersionFactory from '../db/__testSetup__/factories/documentVersion'
import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'
import constants from '../db/__testSetup__/constants'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import apiErrorTypes from '../constants/apiErrorTypes'

describe('BusinessField', () => {
  let factoryProject
  let factoryDocument

  beforeAll(async () => {
    await initializeTestDb()
    factoryProject = (await ProjectFactory.createMany(1))[0]
    factoryDocument = (await DocumentFactory.createMany(1, {
      projectId: factoryProject.id
    }))[0]
  })

  describe('#createForDocument', () => {
    const fieldBody = {
      name: 'test-field',
      orgId: constants.ORG_ID,
      type: 1
    }
    let field
    let fieldA

    beforeAll(async () => {
      fieldA = (await FieldFactory.createMany(1, { documentId: factoryDocument.id, order: 0 }))[0]
      field = await BusinessField.createForDocument(factoryDocument.id, {
        ...fieldBody,
        documentId: factoryDocument.id
      })
    })

    it('should return the saved field as a POJO', () => {
      // eslint-disable-next-line no-unused-vars
      const { orgId, ...expectedBody } = fieldBody
      expect(field).toEqual(expect.objectContaining(expectedBody))
      expect(field.constructor).toBe(Object)
      expect(Object.keys(field)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.FIELD]))
    })

    it('should give the field the correct order: value', () => {
      expect(field.order).toEqual(1)
    })

    it('should update other doc fields with out of sync order values', async () => {
      const updatedFactoryField = await fieldA.reload()
      expect(updatedFactoryField.order).toEqual(0)
    })

    describe('when the parent document does not exist', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessField.createForDocument(0, {
            ...fieldBody
          })
        ).rejects.toThrow()
      })
    })

    describe('when the field is set to a string type but receives a number value', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessField.createForDocument(factoryDocument.id, {
            ...fieldBody,
            value: 30
          })
        ).rejects.toEqual(expect.objectContaining({ code: 400, errorType: apiErrorTypes.FieldValueIncorrectTypeError }))
      })
    })

    describe('when the field is set to a number type', () => {
      describe('and receives a string value', () => {
        it('should throw an error', async () => {
          await expect(
            BusinessField.createForDocument(factoryDocument.id, {
              ...fieldBody,
              type: 3,
              value: 'some test string'
            })
          ).rejects.toEqual(expect.objectContaining({ code: 400, errorType: apiErrorTypes.FieldValueIncorrectTypeError }))
        })
      })

      describe(`and receives a number with less than 15 significant digits`, () => {
        it('should not throw an error', async () => {
          const createdNumberField = await BusinessField.createForDocument(
            factoryDocument.id,
            {
              ...fieldBody,
              type: 3,
              value: 1111111111.99999
            }
          )
          expect(createdNumberField.constructor).toBe(Object)
        })
      })

      describe(`and receives a number with greater than 15 significant digits`, () => {
        it('should throw an error', async () => {
          await expect(
            BusinessField.createForDocument(factoryDocument.id, {
              ...fieldBody,
              type: 3,
              value: 1111111111.999999
            })
          ).rejects.toEqual(expect.objectContaining({ code: 400, errorType: apiErrorTypes.ValidationError }))
        })
      })
    })
  })

  describe('#updateByIdForDocument', () => {
    let factoryField
    let fieldId
    let orgId
    let documentId
    let updateFactoryDocument

    const updateBody = {
      name: 'an-updated-name',
    }

    beforeAll(async () => {
      factoryProject = (await ProjectFactory.createMany(1))[0]
      updateFactoryDocument = (await DocumentFactory.createMany(1, { projectId: factoryProject.id }))[0]
      factoryField = (await FieldFactory.createMany(1, { documentId: updateFactoryDocument.id, type: 1 }))[0]
      fieldId = factoryField.id
      orgId = factoryField.orgId
      documentId = factoryField.documentId
    })

    describe('when the target field is found', () => {
      let updatedField

      beforeAll(async () => {
        updatedField = await BusinessField.updateByIdForDocument(factoryField.id, documentId, orgId, updateBody)
      })

      it('should return a POJO with updated body fields', () => {
        expect(updatedField).toEqual(expect.objectContaining(updateBody))
        expect(updatedField.constructor).toBe(Object)
      })
    })

    describe('when the target field is published', () => {
      let publishedField

      beforeAll(async () => {
        const version = (await DocumentVersionFactory.createMany(
          1, { documentId: updateFactoryDocument.id })
        )[0]
        publishedField = (await FieldFactory.createMany(1, {
          documentId: updateFactoryDocument.id,
          type: factoryField.type,
          versionId: version.id
        }))[0]
      })

      it('should throw an error', async () => {
        await expect(
          BusinessField.updateByIdForDocument(publishedField.id, documentId, orgId, updateBody)
        ).rejects.toEqual(expect.objectContaining({ code: 403 }))
      })
    })

    describe('when the target field is not found', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessField.updateByIdForDocument(0, documentId, orgId, updateBody)
        ).rejects.toThrow()
      })
    })

    describe('when the target document is not found', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessField.updateByIdForDocument(fieldId, 0, orgId, updateBody)
        ).rejects.toThrow()
      })
    })

    describe('when the target field does not belong to the organization', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessField.updateByIdForDocument(fieldId, documentId, 0, updateBody)
        ).rejects.toThrow()
      })
    })

    describe('when the update value is not acceptable for the saved field type', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessField.updateByIdForDocument(fieldId, documentId, orgId, { ...updateBody, value: 99 })
        ).rejects.toThrow()
      })
    })
  })

  describe('field fetching', () => {
    let documentForFields
    const versionId = 12

    beforeAll(async () => {
      await clearDb()
      factoryProject = (await ProjectFactory.createMany(1))[0]
      documentForFields = (await DocumentFactory.createMany(3, {
        orgId: factoryProject.orgId,
        publishedVersionId: versionId,
        projectId: factoryProject.id
      }))[0]

      await DocumentVersionFactory.createMany(1, {
        id: versionId,
        documentId: documentForFields.id
      })

      await FieldFactory.createMany(2, {
        documentId: documentForFields.id,
        orgId: constants.ORG_2_ID
      })
    })

    describe('#findAllPublishedForDocument', () => {
      let fields

      beforeAll(async () => {
        await FieldFactory.createMany(4, {
          documentId: documentForFields.id,
          orgId: documentForFields.orgId,
          versionId
        })

        fields = await BusinessField.findAllPublishedForDocument(documentForFields.id, documentForFields.orgId)
      })

      it('should return all published fields', async () => {
        expect(fields.length).toEqual(4)
      })

      it('should return fields as POJOs', () => {
        for (const field of fields) {
          expect(field.constructor).toBe(Object)
          expect(Object.keys(field)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.FIELD]))
          expect(field.value).toBeDefined()
        }
      })
    })

    describe('#findAllForDocument', () => {
      let fields

      beforeAll(async () => {
        await FieldFactory.createMany(5, {
          documentId: documentForFields.id
        })

        fields = await BusinessField.findAllForDocument(documentForFields.id, documentForFields.orgId)
      })

      it('should return all fields from passed in document and org', () => {
        expect(fields.length).toEqual(5)
      })

      it('should return fields as POJOs', () => {
        for (const field of fields) {
          expect(field.constructor).toBe(Object)
          expect(Object.keys(field)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.FIELD]))
          expect(field.value).toBeDefined()
        }
      })
    })

    describe('#findByIdForDocument', () => {
      let targetFieldId
      let field

      beforeAll(async () => {
        const factoryFields = await FieldFactory.createMany(3, {
          documentId: documentForFields.id
        })
        targetFieldId = factoryFields[0].id
      })

      describe('when the target field has the passed in orgId and documentId', () => {
        beforeAll(async () => {
          field = await BusinessField.findByIdForDocument(
            targetFieldId,
            documentForFields.id,
            constants.ORG_ID
          )
        })

        it('should return a field as POJO', () => {
          expect(field.id).toBe(targetFieldId)
          expect(field.constructor).toBe(Object)
          expect(Object.keys(field)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.FIELD]))
        })
      })

      describe('when the target field does not have the passed in orgId', () => {
        beforeAll(async () => {
          field = await BusinessField.findByIdForDocument(targetFieldId, constants.ORG_ID_2)
        })

        it('should return null', () => {
          expect(field).toBe(null)
        })
      })
    })
  })

  describe('#deleteByIdForDocument', () => {
    let fieldA
    let fieldB
    let fieldC
    let documentToDelete


    beforeAll(async () => {
      await clearDb()
      factoryProject = (await ProjectFactory.createMany(1))[0]
      documentToDelete = (await DocumentFactory.createMany(1, { projectId: factoryProject.id }))[0]
      fieldA = (await FieldFactory.createMany(1, { documentId: documentToDelete.id, order: 0 }))[0]
      fieldB = (await FieldFactory.createMany(1, { documentId: documentToDelete.id, order: 1 }))[0]
      fieldC = (await FieldFactory.createMany(1, { documentId: documentToDelete.id, order: 2 }))[0]
    })

    describe('when the field is successfully deleted', () => {
      beforeAll(async () => {
        await BusinessField.deleteByIdForDocument(fieldB.id, documentToDelete.id, constants.ORG_ID)
      })

      it('should remove the field from the db', async () => {
        await expect(
          fieldB.reload()
        ).rejects.toThrow()
      })

      it('should re-order remaining fields for the document', async () => {
        const updatedFieldA = await fieldA.reload()
        const updatedFieldC = await fieldC.reload()
        expect(updatedFieldA.order).toEqual(0)
        expect(updatedFieldC.order).toEqual(1)
      })
    })

    describe('when the field is published', () => {
      let publishedField

      beforeAll(async () => {
        const version = (await DocumentVersionFactory.createMany(
          1, { documentId: documentToDelete.id })
        )[0]

        publishedField = (await FieldFactory.createMany(1, {
          documentId: documentToDelete.id,
          type: fieldC.type,
          versionId: version.id
        }))[0]
      })

      it('should throw an error', async () => {
        await expect(
          BusinessField.deleteByIdForDocument(publishedField.id, documentToDelete.id, constants.ORG_ID)
        ).rejects.toEqual(expect.objectContaining({ code: 403 }))
      })
    })


    it('should throw an error if the target field is not found', async () => {
      await expect(
        BusinessField.deleteByIdForDocument(0, documentToDelete.id, constants.ORG_ID)
      ).rejects.toThrow()
    })

    it('should throw an error if the document does not have the passed in documentId', async () => {
      await expect(
        BusinessField.deleteByIdForDocument(fieldB.id, 0, constants.ORG_ID)
      ).rejects.toThrow()
    })

    it('should throw an error if the document does not have the passed in orgId', async () => {
      await expect(
        BusinessField.deleteByIdForDocument(fieldB.id, documentToDelete.id, constants.ORG_ID_2)
      ).rejects.toThrow()
    })
  })

  describe('#updateOrderById', () => {
    let factoryProject
    let factoryDocument
    let factoryField

    beforeAll(async () => {
      await clearDb()
      factoryProject = (await ProjectFactory.createMany(1))[0]
      factoryDocument = (await DocumentFactory.createMany(1, { projectId: factoryProject.id }))[0]
      factoryField = (await FieldFactory.createMany(1, { documentId: factoryDocument.id, order: 0 }))[0]
    })

    it('should throw an error if passed an order value below zero', async () => {
      await expect(
        BusinessField.updateOrderById(factoryField, factoryDocument.id, constants.ORG_ID, -1)
      ).rejects.toEqual(expect.objectContaining({ code: 400 }))
    })

    it('should throw an error when the field does not exist', async () => {
      await expect(
        BusinessField.updateOrderById(0, factoryDocument.id, constants.ORG_ID, 0)
      ).rejects.toEqual(expect.objectContaining({ code: 404 }))
    })

    it('should resolve if the order position is not changing', async () => {
      await expect(
        BusinessField.updateOrderById(factoryField.id, factoryDocument.id, constants.ORG_ID, 0)
      ).resolves.toEqual(undefined)
    })

    it('should throw an error if the order position is set to a value greater than the document field count - 1', async () => {
      await expect(
        BusinessField.updateOrderById(factoryField.id, factoryDocument.id, constants.ORG_ID, 3)
      ).rejects.toEqual(expect.objectContaining({ code: 409 }))
    })

    describe('order re-assignment', async () => {
      let fieldA
      let fieldB
      let fieldC
      let factoryDocuments
      let fieldForAnotherDoc

      beforeEach(async () => {
        await clearDb()
        factoryProject = (await ProjectFactory.createMany(1))[0]
        factoryDocuments = await DocumentFactory.createMany(2, { projectId: factoryProject.id })

        factoryDocument = factoryDocuments[0]
        fieldA = (await FieldFactory.createMany(1, { documentId: factoryDocument.id, order: 0 }))[0]
        fieldB = (await FieldFactory.createMany(1, { documentId: factoryDocument.id, order: 1 }))[0]
        fieldC = (await FieldFactory.createMany(1, { documentId: factoryDocument.id, order: 2 }))[0]

        // Create fields for another doc so we can make sure order is not impacted
        fieldForAnotherDoc = (
          await FieldFactory.createMany(1,
            { documentId: factoryDocuments[1].id, order: 1 })
        )[0]
      })

      it('should successfully move lowest item to the highest order position', async () => {
        await BusinessField.updateOrderById(fieldA.id, factoryDocument.id, factoryDocument.orgId, 2)
        const updatedFieldA = await fieldA.reload()
        const updatedFieldB = await fieldB.reload()
        const updatedFieldC = await fieldC.reload()
        expect(updatedFieldA.order).toEqual(2)
        expect(updatedFieldB.order).toEqual(0)
        expect(updatedFieldC.order).toEqual(1)

        const updatedFieldForAnotherDoc = await fieldForAnotherDoc.reload()
        expect(updatedFieldForAnotherDoc.order).toEqual(1)
      })

      it('should successfully move lowest item to the middle order position', async () => {
        await BusinessField.updateOrderById(fieldA.id, factoryDocument.id, constants.ORG_ID, 1)
        const updatedFieldA = await fieldA.reload()
        const updatedFieldB = await fieldB.reload()
        const updatedFieldC = await fieldC.reload()
        expect(updatedFieldA.order).toEqual(1)
        expect(updatedFieldB.order).toEqual(0)
        expect(updatedFieldC.order).toEqual(2)

        const updatedFieldForAnotherDoc = await fieldForAnotherDoc.reload()
        expect(updatedFieldForAnotherDoc.order).toEqual(1)
      })

      it('should successfully move middle item to lowest order position', async () => {
        await BusinessField.updateOrderById(fieldB.id, factoryDocument.id, constants.ORG_ID, 0)
        const updatedFieldA = await fieldA.reload()
        const updatedFieldB = await fieldB.reload()
        const updatedFieldC = await fieldC.reload()
        expect(updatedFieldA.order).toEqual(1)
        expect(updatedFieldB.order).toEqual(0)
        expect(updatedFieldC.order).toEqual(2)

        const updatedFieldForAnotherDoc = await fieldForAnotherDoc.reload()
        expect(updatedFieldForAnotherDoc.order).toEqual(1)
      })

      it('should successfully move middle item to highest order position', async () => {
        await BusinessField.updateOrderById(fieldB.id, factoryDocument.id, constants.ORG_ID, 2)
        const updatedFieldA = await fieldA.reload()
        const updatedFieldB = await fieldB.reload()
        const updatedFieldC = await fieldC.reload()
        expect(updatedFieldA.order).toEqual(0)
        expect(updatedFieldB.order).toEqual(2)
        expect(updatedFieldC.order).toEqual(1)

        const updatedFieldForAnotherDoc = await fieldForAnotherDoc.reload()
        expect(updatedFieldForAnotherDoc.order).toEqual(1)
      })

      it('should successfully move last item to first order position', async () => {
        await BusinessField.updateOrderById(fieldC.id, factoryDocument.id, constants.ORG_ID, 0)
        const updatedFieldA = await fieldA.reload()
        const updatedFieldB = await fieldB.reload()
        const updatedFieldC = await fieldC.reload()
        expect(updatedFieldA.order).toEqual(1)
        expect(updatedFieldB.order).toEqual(2)
        expect(updatedFieldC.order).toEqual(0)

        const updatedFieldForAnotherDoc = await fieldForAnotherDoc.reload()
        expect(updatedFieldForAnotherDoc.order).toEqual(1)
      })

      it('should successfully move last item to middle order position', async () => {
        await BusinessField.updateOrderById(fieldC.id, factoryDocument.id, constants.ORG_ID, 1)
        const updatedFieldA = await fieldA.reload()
        const updatedFieldB = await fieldB.reload()
        const updatedFieldC = await fieldC.reload()
        expect(updatedFieldA.order).toEqual(0)
        expect(updatedFieldB.order).toEqual(2)
        expect(updatedFieldC.order).toEqual(1)

        const updatedFieldForAnotherDoc = await fieldForAnotherDoc.reload()
        expect(updatedFieldForAnotherDoc.order).toEqual(1)
      })

      it('should re-order out of sync field items before moving', async () => {
        const outOfSyncField = (await FieldFactory.createMany(1, { documentId: factoryDocument.id, order: 5 }))[0]
        await BusinessField.updateOrderById(fieldC.id, factoryDocument.id, constants.ORG_ID, 3)
        const updatedOutOfSyncField = await outOfSyncField.reload()
        const updatedFieldC = await fieldC.reload()
        expect(updatedOutOfSyncField.order).toEqual(2)
        expect(updatedFieldC.order).toEqual(3)

        const updatedFieldForAnotherDoc = await fieldForAnotherDoc.reload()
        expect(updatedFieldForAnotherDoc.order).toEqual(1)
      })
    })
  })
})
