module.exports = (sequelize, DataTypes) => {
  const Webhook = sequelize.define('Webhook', {
    projectId: DataTypes.INTEGER,
    orgId: DataTypes.INTEGER,
    url: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {})

  Webhook.associate = function(models) {
    Webhook.belongsTo(models.Project, {
      foreignKey: 'projectId'
    })

    Webhook.hasMany(models.WebhookDelivery, {
      foreignKey: 'webhookId'
    })
  };
  return Webhook;
}