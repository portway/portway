module.exports = (sequelize, DataTypes) => {
  const FieldTypeDateValue = sequelize.define('FieldTypeDateValue', {
    orgId: DataTypes.INTEGER,
    value: {
      type: DataTypes.DATE
    }
  }, {
    paranoid: true
  })
  FieldTypeDateValue.associate = function(models) {
    // associations can be defined here
  }
  return FieldTypeDateValue;
}