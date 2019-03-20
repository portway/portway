export default function(sequelize, DataTypes) {
  const Project = sequelize.define(
    'Project',
    {
      name: DataTypes.STRING,
      orgId: DataTypes.INTEGER
    },
    {}
  )
  Project.associate = function(models) {
    Project.belongsTo(models.Organization, {
      foreignKey: 'orgId'
    })
  }
  return Project
}
