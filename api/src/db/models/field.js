import fieldTypes from '../../constants/fieldTypes'

module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define(
    'Field',
    {
      orgId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      docId: DataTypes.INTEGER,
      versionId: DataTypes.INTEGER,
      fieldValueId: DataTypes.INTEGER,
      type: DataTypes.INTEGER,
      order: DataTypes.INTEGER
    },
    {
      getterMethods: {
        value() {
          const modelName = fieldTypes.FIELD_TYPE_MODELS[this.type]
          const fieldValueData = this.getDataValue(modelName)
          return fieldValueData && fieldValueData.get('value')
        },
        structuredValue() {
          const modelName = fieldTypes.FIELD_TYPE_MODELS[this.type]
          const fieldValueData = this.getDataValue(modelName)
          return fieldValueData && fieldValueData.get('structuredValue')
        }
      }
    }
  )
  Field.associate = function(models) {
    Field.belongsTo(models.Document, {
      foreignKey: 'docId'
    })
    Object.keys(fieldTypes.FIELD_TYPE_MODELS).forEach((typeNumber) => {
      const modelName = fieldTypes.FIELD_TYPE_MODELS[typeNumber]
      const model = models[modelName]
      Field.hasOne(model, {
        sourceKey: 'fieldValueId',
        foreignKey: 'fieldId',
        constraints: false
      })
      model.belongsTo(Field, {
        foreignKey: 'fieldId',
        constraints: false
      })
    })
  }

  // Field.findAllPopulated = async function(options) {
  //   // return await this.sequelize.query(
  //   //   `SELECT * FROM "Fields" AS "Field", "FieldTypeStringValue"."orgId" AS "FieldTypeStringValue.orgId", "FieldTypeStringValue"."value" AS "FieldTypeStringValue.value", "FieldTypeStringValue"."createdAt" AS "FieldTypeStringValue.createdAt", "FieldTypeStringValue"."updatedAt" AS "FieldTypeStringValue.updatedAt", "FieldTypeStringValue"."fieldId" AS "FieldTypeStringValue.fieldId"
  //   //   LEFT OUTER JOIN "FieldTypeStringValues" AS "FieldTypeStringValue" ON "Field"."id" = "FieldTypeStringValue"."fieldId"
  //   //   LEFT OUTER JOIN "FieldTypeTextValues" AS "FieldTypeTextValue" ON "Field"."id" = "FieldTypeTextValue"."fieldId"
  //   //   LEFT OUTER JOIN "FieldTypeNumberValues" AS "FieldTypeNumberValue" ON "Field"."id" = "FieldTypeNumberValue"."fieldId"
  //   //   WHERE "Field"."docId" = ${docId} AND "Field"."orgId" = ${orgId};`,
  //   //   {
  //   //     model: Field,
  //   //     mapToModel: true // pass true here if you have any mapped fields
  //   //   }
  //   // )

  //   const include = Object.values(fieldTypes.FIELD_TYPE_MODELS).map((modelName) => {
  //     return {
  //       model: this.sequelize.model(modelName)
  //     }
  //   })

  //   return this.findAll({ ...options, include })
  // }

  return Field
}
