// See ../seedData/docsWithFields to add docs and fields to seeding!
//
// This seeder processes that file to make adding fields and relationships
// much easier without having to track ids, value tables etc.
const seedDocsWithFields = require('../seedData/docsWithFields')
const FIELD_TYPES = require('../config/fieldTypeValues')
const TODAY = new Date()

const docs = []
const fields = []
const fieldValuesByType = {
  [FIELD_TYPES.STRING]: [],
  [FIELD_TYPES.NUMBER]: [],
  [FIELD_TYPES.TEXT]: []
}

let docStartId = 120000
let fieldStartId = 130000

seedDocsWithFields.forEach((doc) => {
  docStartId += 1

  const dbDoc = {
    id: docStartId,
    name: doc.name,
    orgId: doc.orgId,
    projectId: doc.projectId,
    createdAt: TODAY,
    updatedAt: TODAY
  }
  docs.push(dbDoc)

  if (!doc.fields || !doc.fields.length) {
    return
  }

  doc.fields.forEach((field, index) => {
    // Both the field and field_value will have the same id
    // for ease of playing with seed data
    fieldStartId += 1
    const dbField = {
      id: fieldStartId,
      orgId: doc.orgId,
      name: field.name,
      documentId: dbDoc.id,
      type: field.type,
      fieldValueId: fieldStartId,
      order: index,
      createdAt: TODAY,
      updatedAt: TODAY
    }
    const dbValue = {
      id: fieldStartId,
      value: field.value,
      orgId: doc.orgId,
      fieldId: fieldStartId,
      createdAt: TODAY,
      updatedAt: TODAY
    }

    if (field.structuredValue) {
      dbValue.structuredValue = field.structuredValue
    }

    fields.push(dbField)
    fieldValuesByType[field.type].push(dbValue)
  })
})

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Documents', docs, {})
      .then(() => {
        return queryInterface.bulkInsert('Fields', fields, {})
      })
      .then(() => {
        return queryInterface.bulkInsert('FieldTypeNumberValues',
          fieldValuesByType[FIELD_TYPES.NUMBER], {})
      })
      .then(() => {
        return queryInterface.bulkInsert('FieldTypeStringValues',
          fieldValuesByType[FIELD_TYPES.STRING], {})
      })
      .then(() => {
        return queryInterface.bulkInsert('FieldTypeTextValues',
          fieldValuesByType[FIELD_TYPES.TEXT], {})
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Documents', null, {})
      .then(() => {
        return queryInterface.bulkDelete('Fields', null, {})
      })
      .then(() => {
        return queryInterface.bulkDelete('FieldTypeNumberValues', null, {})
      })
      .then(() => {
        return queryInterface.bulkDelete('FieldTypeStringValues', null, {})
      })
      .then(() => {
        return queryInterface.bulkDelete('FieldTypeTextValues', null, {})
      })
  }
}
