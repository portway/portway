export default function(sequelize, DataTypes) {
  const Project = sequelize.define(
    'Project',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {}
  )
  Project.associate = function(models) {
    // associations can be defined here
  }
  return Project
}
