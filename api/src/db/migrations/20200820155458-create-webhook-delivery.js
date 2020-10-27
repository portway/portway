module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('WebhookDeliveries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      webhookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Webhooks',
          key: 'id'
        }
      },
      orgId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Organizations',
          key: 'id'
        }
      },
      resultCode: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('WebhookDeliveries');
  }
};