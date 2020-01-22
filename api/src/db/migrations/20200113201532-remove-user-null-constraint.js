module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'orgId', {
      allowNull: true,
      type: Sequelize.INTEGER
    })
  },

  down: (queryInterface, Sequelize) => {
    return new Promise((resolve, reject) => { resolve() })
  }
}
