export default function(sequelize, DataTypes) {
  const Project = sequelize.define(
    'Project',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      orgId: DataTypes.INTEGER
    },
    {}
  )
  Project.associate = function(models) {
    Project.belongsTo(models.Organization, {
      foreignKey: 'orgId'
    })
    // Project.belongsToMany(models.User, {
    //   through: models.ProjectUser,
    //   foreignKey: 'projectId',
    //   otherKey: 'userId'
    // })
  }
  return Project
}
