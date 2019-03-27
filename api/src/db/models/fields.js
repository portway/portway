
module.exports = (sequelize, DataTypes) => {
  const Fields = sequelize.define('Field', {
    orgId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    docId: DataTypes.INTEGER,
    versionId: DataTypes.INTEGER,
    fieldValueId: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    order: DataTypes.INTEGER
  }, {})
  Fields.associate = function(models) {
    // associations can be defined here
  }
  return Fields
}