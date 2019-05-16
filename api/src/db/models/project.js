export default function(sequelize, DataTypes) {
  const Project = sequelize.define(
    'Project',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      orgId: DataTypes.INTEGER,
      accessLevel: {
        type: DataTypes.STRING,
        defaultValue: null
      }
    },
    {
      paranoid: true
    }
  )
  Project.associate = function(models) {
    Project.belongsTo(models.Organization, {
      foreignKey: 'orgId'
    })

    Project.hasMany(models.ProjectUser, {
      foreignKey: 'projectId'
    })
  }
  return Project
}
