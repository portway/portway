
module.exports = (sequelize, DataTypes) => {
  const WebhookDelivery = sequelize.define('WebhookDelivery', {
    webhookId: DataTypes.INTEGER,
    orgId: DataTypes.INTEGER,
    resultCode: DataTypes.STRING
  }, {
    updatedAt: false
  })
  WebhookDelivery.associate = function(models) {
    WebhookDelivery.belongsTo(models.Webhook, {
      foreignKey: 'webhookId'
    })
  }
  return WebhookDelivery;
};