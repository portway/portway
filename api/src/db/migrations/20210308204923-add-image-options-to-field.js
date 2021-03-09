module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Fields', 'alignment', Sequelize.STRING)
    return queryInterface.addColumn('Fields', 'alt', Sequelize.STRING)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Fields', 'alignment')
    await queryInterface.removeColumn('Fields', 'alt')
  }
}
