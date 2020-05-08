module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Organizations', 'allowUserProjectCreation', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Organizations', 'allowUserProjectCreation', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  }
}
