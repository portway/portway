
module.exports = (sequelize, DataTypes) => {
  const DocumentVersions = sequelize.define('DocumentVersion', {
    versionNumber: DataTypes.INTEGER,
    docId: DataTypes.INTEGER,
    orgId: DataTypes.INTEGER
  }, {})
  DocumentVersions.associate = function(models) {
    // associations can be defined here
  }
  return DocumentVersions
}