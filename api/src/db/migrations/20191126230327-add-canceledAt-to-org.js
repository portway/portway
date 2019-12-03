
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Organizations', 'canceledAt', Sequelize.DATE)
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Organizations', 'canceledAt')
    ])
  }
}
