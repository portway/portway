module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'orgId', {
      allowNull: true,
      type: Sequelize.INTEGER
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'orgId', {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Organizations',
        key: 'id'
      }
    })
  }
}
