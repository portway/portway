
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('DocumentVersions', 'slug', Sequelize.STRING)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('DocumentVersions', 'slug')
  }
};

