
module.exports = (sequelize, DataTypes) => {
  const FieldTypeStringValues = sequelize.define('FieldTypeStringValue', {
    orgId: DataTypes.INTEGER,
    value: DataTypes.STRING
  }, {})
  FieldTypeStringValues.associate = function(models) {
    // associations can be defined here
  }
  return FieldTypeStringValues
}