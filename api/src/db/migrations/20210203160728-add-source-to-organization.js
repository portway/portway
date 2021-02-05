module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Organizations', 'source', Sequelize.STRING)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Organizations', 'source')
  }
};
