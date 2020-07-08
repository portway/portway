module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Documents', 'slug', Sequelize.STRING)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Documents', 'slug')
  }
};
