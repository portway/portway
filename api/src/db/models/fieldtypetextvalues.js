
module.exports = (sequelize, DataTypes) => {
  const FieldTypeTextValues = sequelize.define('FieldTypeTextValue', {
    orgId: DataTypes.INTEGER,
    value: DataTypes.TEXT,
    structuredValue: DataTypes.JSON
  }, {})
  FieldTypeTextValues.associate = function(models) {
    // associations can be defined here
  }
  return FieldTypeTextValues
}