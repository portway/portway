module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Fields', 'meta', Sequelize.JSON)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Fields', 'meta')
  }
}
