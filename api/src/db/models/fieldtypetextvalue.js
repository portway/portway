
module.exports = (sequelize, DataTypes) => {
  const FieldTypeTextValue = sequelize.define('FieldTypeTextValue', {
    orgId: DataTypes.INTEGER,
    value: DataTypes.TEXT,
    structuredValue: DataTypes.JSON
  }, {
    paranoid: true
  })
  FieldTypeTextValue.associate = function(models) {
    // associations can be defined here
  }
  return FieldTypeTextValue
}