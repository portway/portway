
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
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      docId: {
        type: Sequelize.INTEGER
      },
      versionId: {
        type: Sequelize.INTEGER
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
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Fields')
  }
}