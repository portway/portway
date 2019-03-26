
module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define('Field', {
    name: DataTypes.STRING,
    type: DataTypes.INTEGER,
    value: DataTypes.TEXT,
    orgId: DataTypes.INTEGER,
    documentId: DataTypes.INTEGER
  }, {})
  Field.associate = function(models) {
    Field.belongsTo(models.Document, {
      foreignKey: 'documentId'
    })
    Field.belongsTo(models.Organization, {
      foreignKey: 'orgId'
    })
  }
  return Field
}