
module.exports = (sequelize, DataTypes) => {
  const FieldTypeStringValue = sequelize.define('FieldTypeStringValue', {
    orgId: DataTypes.INTEGER,
    value: DataTypes.STRING
  }, {
    paranoid: true
  })
  FieldTypeStringValue.associate = function(models) {
    // associations can be defined here
  }
  return FieldTypeStringValue
}