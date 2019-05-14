
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Fields', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orgId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Organizations',
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING
      },
      docId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Documents',
          key: 'id'
        }
      },
      versionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'DocumentVersions',
          key: 'id'
        }
      },
      fieldValueId: {
        type: Sequelize.INTEGER
      },
      type: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      order: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Fields')
  }
}