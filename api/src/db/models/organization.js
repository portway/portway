module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define(
    'Organization',
    {
      name: DataTypes.STRING,
      ownerId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'User',
          key: 'id'
        }
      }
    },
    {}
  )
  Organization.associate = function(models) {
    Organization.belongsTo(models.User, {
      as: 'Owner',
      foreignKey: 'ownerId',
      constraints: false // lets the org table get created before the users
    })
  }
  return Organization
}