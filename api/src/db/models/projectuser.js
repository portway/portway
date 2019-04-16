
module.exports = (sequelize, DataTypes) => {
  const ProjectUser = sequelize.define(
    'ProjectUser',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      projectId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      orgId: DataTypes.INTEGER,
      roleId: DataTypes.INTEGER
    },
    {
      updatedAt: false, // don't use updatedAt timestamp
      freezeTableName: true,
      tableName: 'ProjectsUsers'
    }
  )
  ProjectUser.associate = function(models) {
    ProjectUser.belongsTo(models.Project, {
      foreignKey: 'projectId',
      constraints: false
    })
    ProjectUser.belongsTo(models.User, {
      foreignKey: 'userId',
      constraints: false
    })
  }
  return ProjectUser
}