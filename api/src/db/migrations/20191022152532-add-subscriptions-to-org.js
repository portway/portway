
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Organizations', 'plan', Sequelize.STRING),
      queryInterface.addColumn('Organizations', 'subscriptionStatus', Sequelize.STRING)
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Organizations', 'plan'),
      queryInterface.removeColumn('Organizations', 'plan')
    ])
  }
}
