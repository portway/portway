import fieldTypes from '../../constants/fieldTypes'

module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define(
    'Field',
    {
      orgId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      documentId: DataTypes.INTEGER,
      versionId: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      type: DataTypes.INTEGER,
      order: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0
        }
      },
      meta: DataTypes.JSON
    },
    {
      paranoid: true,
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
      foreignKey: 'documentId'
    })
    Object.keys(fieldTypes.FIELD_TYPE_MODELS).forEach((typeNumber) => {
      const modelName = fieldTypes.FIELD_TYPE_MODELS[typeNumber]
      const model = models[modelName]
      Field.hasOne(model, {
        foreignKey: 'fieldId',
        onDelete: 'cascade'
      })
    })
  }

  Field.prototype.addFieldValue = function(valueBody) {
    const modelName = fieldTypes.FIELD_TYPE_MODELS[this.type]
    return this[`create${modelName}`](valueBody)
  }

  Field.prototype.setFieldValue = function(fieldValue) {
    const modelName = fieldTypes.FIELD_TYPE_MODELS[this.type]
    return this[`set${modelName}`](fieldValue)
  }

  Field.prototype.getFieldValue = function() {
    const modelName = fieldTypes.FIELD_TYPE_MODELS[this.type]
    return this[`get${modelName}`]()
  }

  Field.prototype.markUpdated = function(valueBody) {
    this.setDataValue('updatedAt', Date.now())
    return this.save()
  }

  return Field
}
