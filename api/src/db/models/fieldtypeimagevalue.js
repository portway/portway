module.exports = (sequelize, DataTypes) => {
  const FieldTypeImageValue = sequelize.define(
    'FieldTypeImageValue',
    {
      orgId: DataTypes.INTEGER,
      value: DataTypes.TEXT
    },
    {
      paranoid: true
    }
  )
  FieldTypeImageValue.associate = function(models) {
    // associations can be defined here
  }
  return FieldTypeImageValue
}
