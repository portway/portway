import { PLANS } from '../../constants/plans'

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
      },
      allowUserProjectCreation: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      stripeId: DataTypes.STRING,
      avatar: DataTypes.STRING,
      plan: DataTypes.ENUM(Object.keys(PLANS)),
      subscriptionStatus: DataTypes.STRING,
      canceledAt: DataTypes.DATE,
      introProjectId: DataTypes.INTEGER,
      source: DataTypes.STRING
    },
    {
      paranoid: true
    }
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