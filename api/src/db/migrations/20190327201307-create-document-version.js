
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
        type: Sequelize.INTEGER
      },
      orgId: {
        type: Sequelize.INTEGER
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