
module.exports = (sequelize, DataTypes) => {
  const ProjectToken = sequelize.define('ProjectToken', {
    name: DataTypes.STRING,
    secret: DataTypes.STRING,
    token: DataTypes.STRING,
    orgId: DataTypes.INTEGER,
    projectId: DataTypes.INTEGER,
    roleId: DataTypes.INTEGER
  }, {})
  ProjectToken.associate = function(models) {
    // associations can be defined here
  }
  return ProjectToken
}