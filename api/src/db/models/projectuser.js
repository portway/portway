
module.exports = (sequelize, DataTypes) => {
  const ProjectUser = sequelize.define('ProjectUser', {
    projectId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    orgId: DataTypes.INTEGER
  }, {
    updatedAt: false // don't use updatedAt timestamp
  })
  ProjectUser.associate = function(models) {
    ProjectUser.belongsTo(models.Project, { foreignKey: 'projectId' })
    ProjectUser.belongsTo(models.User, { foreignKey: 'userId' })
  }
  return ProjectUser
}