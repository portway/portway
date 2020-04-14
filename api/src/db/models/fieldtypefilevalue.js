module.exports = (sequelize, DataTypes) => {
  const FieldTypeFileValue = sequelize.define(
    'FieldTypeFileValue',
    {
      orgId: DataTypes.INTEGER,
      value: DataTypes.TEXT
    },
    {
      paranoid: true
    }
  )
  FieldTypeFileValue.associate = function(models) {
    // associations can be defined here
  }
  return FieldTypeFileValue
}
