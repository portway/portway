module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      orgId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Organizations',
          key: 'id'
        }
      },
      orgRoleId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      password: {
        type: Sequelize.STRING
      },
      resetKey: {
        type: Sequelize.STRING
      },
      avatar: {
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
    return queryInterface.dropTable('Users')
  }
}