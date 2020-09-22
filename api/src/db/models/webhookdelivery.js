
module.exports = (sequelize, DataTypes) => {
  const WebhookDelivery = sequelize.define('WebhookDelivery', {
    webhookId: DataTypes.INTEGER,
    orgId: DataTypes.INTEGER,
    resultCode: DataTypes.INTEGER
  }, {
    // No paranoid, if parent webhook is deleted, all delivery records are deleted immediately
    updatedAt: false
  })
  WebhookDelivery.associate = function(models) {
    WebhookDelivery.belongsTo(models.Webhook, {
      foreignKey: 'webhookId'
    })
  }
  return WebhookDelivery;
};