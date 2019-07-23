
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
      // We're actually deleting these, since they're just referencing two other models and don't contain any lose-able data,
      // no need to keep them around
      // paranoid: true,
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