module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Fields', 'formats', Sequelize.JSON)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Fields', 'formats')
  }
}
