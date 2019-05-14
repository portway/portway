
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    name: DataTypes.STRING,
    publishedVersionId: DataTypes.INTEGER,
    orgId: DataTypes.INTEGER,
    projectId: DataTypes.INTEGER
  }, {
    paranoid: true
  })
  Document.associate = function(models) {
    Document.belongsTo(models.Organization, {
      foreignKey: 'orgId'
    })
    Document.belongsTo(models.Project, {
      foreignKey: 'projectId'
    })
    Document.hasMany(models.Field, {
      foreignKey: 'docId'
    })
  }
  return Document
}