module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Organizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      ownerId: {
        // org should always have an owner, but we have to create
        // the org first, then create the user assigned to the org,
        // then assign the org owner as the user
        type: Sequelize.INTEGER
      },
      allowUserProjectCreation: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      stripeId: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Organizations')
  }
}