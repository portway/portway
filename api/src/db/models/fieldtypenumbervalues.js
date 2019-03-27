
module.exports = (sequelize, DataTypes) => {
  const FieldTypeNumberValues = sequelize.define('FieldTypeNumberValue', {
    orgId: DataTypes.INTEGER,
    value: DataTypes.INTEGER
  }, {})
  FieldTypeNumberValues.associate = function(models) {
    // associations can be defined here
  }
  return FieldTypeNumberValues
}