export default function(sequelize, DataTypes) {
  const Project = sequelize.define(
    'Project',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      orgId: DataTypes.INTEGER,
      public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
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
