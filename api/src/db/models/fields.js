
module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define('Field', {
    orgId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    docId: DataTypes.INTEGER,
    versionId: DataTypes.INTEGER,
    fieldValueId: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    order: DataTypes.INTEGER
  }, {})
  Field.associate = function(models) {
    // associations can be defined here
  }
  return Field
}