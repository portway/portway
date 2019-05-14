
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DocumentVersions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      versionNumber: {
        type: Sequelize.INTEGER
      },
      docId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Documents',
          key: 'id'
        }
      },
      orgId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Organizations',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('DocumentVersions')
  }
}