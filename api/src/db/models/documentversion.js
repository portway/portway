
module.exports = (sequelize, DataTypes) => {
  const DocumentVersion = sequelize.define('DocumentVersion', {
    versionNumber: DataTypes.INTEGER,
    documentId: DataTypes.INTEGER,
    orgId: DataTypes.INTEGER
  }, {
    paranoid: true,
    updatedAt: false
  })
  DocumentVersion.associate = function(models) {
    // associations can be defined here
  }
  return DocumentVersion
}