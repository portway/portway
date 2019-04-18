
module.exports = (sequelize, DataTypes) => {
  const ApiKey = sequelize.define('ApiKey', {
    name: DataTypes.STRING,
    secret: DataTypes.STRING,
    orgId: DataTypes.INTEGER,
    projectId: DataTypes.INTEGER,
    roleId: DataTypes.INTEGER
  }, {})
  ApiKey.associate = function(models) {
    // associations can be defined here
  }
  return ApiKey
}