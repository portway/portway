
module.exports = (sequelize, DataTypes) => {
  const FieldTypeNumberValue = sequelize.define('FieldTypeNumberValue', {
    orgId: DataTypes.INTEGER,
    value: DataTypes.DOUBLE
  }, {
    paranoid: true
  })
  FieldTypeNumberValue.associate = function(models) {
    // associations can be defined here
  }
  return FieldTypeNumberValue
}