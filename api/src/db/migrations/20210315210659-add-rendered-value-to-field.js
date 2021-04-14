module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Fields', 'renderedValue', Sequelize.TEXT)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Fields', 'renderedValue')
  }
}
