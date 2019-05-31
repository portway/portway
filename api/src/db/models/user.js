export default function(sequelize, DataTypes) {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING,
      orgId: DataTypes.INTEGER,
      orgRoleId: DataTypes.INTEGER,
      resetKey: DataTypes.STRING
    },
    {
      paranoid: true,
      getterMethods: {
        pending() {
          // We know if a user has a resetKey and nothing yet set for their password that they are still pending
          const resetKey = this.getDataValue('resetKey')
          const password = this.getDataValue('password')
          return Boolean(resetKey && !password)
        }
      }
    }
  )
  User.associate = function(models) {
    User.belongsTo(models.Organization, {
      foreignKey: 'orgId'
    })
    User.hasMany(models.ProjectUser, {
      foreignKey: 'userId',
      constraints: false,
    })
  }
  return User
}