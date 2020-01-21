module.exports = (sequelize, DataTypes) => {
  const OrganizationResourceUsage = sequelize.define(
    'OrganizationResourceUsage',
    {
      orgId: DataTypes.INTEGER,
      resourceType: DataTypes.INTEGER,
      value: DataTypes.INTEGER
    },
    {
      paranoid: true
    }
  )
  OrganizationResourceUsage.associate = function(models) {
    // associations can be defined here
  }
  return OrganizationResourceUsage
}
