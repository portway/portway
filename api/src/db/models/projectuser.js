
module.exports = (sequelize, DataTypes) => {
  const ProjectUser = sequelize.define(
    'ProjectUser',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      projectId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Projects',
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      orgId: DataTypes.INTEGER
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