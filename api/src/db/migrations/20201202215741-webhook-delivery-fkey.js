'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeConstraint(
        'WebhookDeliveries',
        'WebhookDeliveries_webhookId_fkey',
        { transaction }
      );
      await queryInterface.addConstraint('WebhookDeliveries', ['webhookId'], {
        type: 'foreign key',
        name: 'WebhookDeliveries_webhookId_fkey',
        references: {
          table: 'Webhooks',
          field: 'id',
        },
        onDelete: 'CASCADE',
        transaction
      });
      return transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'WebhookDeliveries',
        'WebhookDeliveries_webhookId_fkey',
        { transaction }
      );
      await queryInterface.addConstraint('WebhookDeliveries', ['webhookId'], {
        type: 'foreign key',
        name: 'WebhookDeliveries_webhookId_fkey',
        references: {
          table: 'Webhooks',
          field: 'id',
        },
        transaction
      });
      return transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
};