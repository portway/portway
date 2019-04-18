import BusinessField from './field'
import ProjectFactory from '../db/__testSetup__/factories/project'
import DocumentFactory from '../db/__testSetup__/factories/document'
import FieldFactory from '../db/__testSetup__/factories/field'
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
    const factoryProjects = await ProjectFactory.createMany(1)
    factoryProject = factoryProjects[0]
    const factoryDocuments = await DocumentFactory.createMany(1, { projectId: factoryProject.id })
    factoryDocument = factoryDocuments[0]
  })

  describe('#createForDocument', () => {
    const fieldBody = {
      name: 'test-field',
      orgId: constants.ORG_ID,
      type: 1
    }
    let field

    beforeAll(async () => {
      field = await BusinessField.createForDocument(factoryDocument.id, {
        ...fieldBody,
        docId: factoryDocument.id
      })
    })

    it('should return the saved field as a POJO', () => {
      // eslint-disable-next-line no-unused-vars
      const { orgId, ...expectedBody } = fieldBody
      expect(field).toEqual(expect.objectContaining(expectedBody))
      expect(field.constructor).toBe(Object)
      expect(Object.keys(field)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.FIELD]))
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
    let docId

    const updateBody = {
      name: 'an-updated-name'
    }

    beforeAll(async () => {
      const factoryFields = await FieldFactory.createMany(1, { docId: factoryDocument.id, type: 1 })
      factoryField = factoryFields[0]
      fieldId = factoryField.id
      orgId = factoryField.orgId
      docId = factoryField.docId
    })

    describe('when the target field is found', () => {
      let updatedField

      beforeAll(async () => {
        updatedField = await BusinessField.updateByIdForDocument(factoryField.id, docId, orgId, {
          ...updateBody,
          docId
        })
      })

      it('should return a POJO with updated body fields', () => {
        expect(updatedField).toEqual(expect.objectContaining(updateBody))
        expect(updatedField.constructor).toBe(Object)
      })
    })

    describe('when the target field is not found', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessField.updateByIdForDocument(0, docId, orgId, updateBody)
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
          BusinessField.updateByIdForDocument(fieldId, docId, 0, updateBody)
        ).rejects.toThrow()
      })
    })

    describe('when the update value is not acceptable for the saved field type', () => {
      it('should throw an error', async () => {
        await expect(
          BusinessField.updateByIdForDocument(fieldId, docId, orgId, { ...updateBody, value: 99 })
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
          expect(Object.keys(field)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.FIELD]))
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
          expect(Object.keys(field)).toEqual(expect.arrayContaining(resourcePublicFields[resourceTypes.FIELD]))
        })
      })

      describe('when the target field does not have the passed in orgId', () => {
        beforeAll(async () => {
          targetFieldId = factoryFields[0].id
          field = await BusinessField.findByIdForDocument(targetFieldId, constants.ORG_ID_2)
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
        BusinessField.deleteByIdForDocument(factoryField.id, factoryDocument.id, constants.ORG_ID)
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
        BusinessField.deleteByIdForDocument(factoryField.id, factoryDocument.id, constants.ORG_ID_2)
      ).rejects.toThrow()
    })
  })
})
