export default function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    orgId: DataTypes.INTEGER
  }, {})
  User.associate = function(models) {
    User.belongsTo(models.Organization, {
      foreignKey: 'orgId'
    })
  }
  return User
}