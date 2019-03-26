
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    name: DataTypes.STRING,
    orgId: DataTypes.INTEGER,
    projectId: DataTypes.INTEGER
  }, {})
  Document.associate = function(models) {
    Document.belongsTo(models.Organization, {
      foreignKey: 'orgId'
    })
    Document.belongsTo(models.Project, {
      foreignKey: 'projectId'
    })
  }
  return Document
}