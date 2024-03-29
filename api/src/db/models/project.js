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
      },
      createdBy: DataTypes.INTEGER
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

  Project.prototype.markUpdated = function(valueBody) {
    this.setDataValue('updatedAt', Date.now())
    return this.save()
  }

  return Project
}
