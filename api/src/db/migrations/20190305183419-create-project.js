module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        allowEmpty: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: true,
        allowEmpty: true,
        type: Sequelize.STRING
      },
      orgId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      accessLevel: {
        type: Sequelize.STRING,
        defaultValue: null
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
    return queryInterface.dropTable('Projects')
  }
}
