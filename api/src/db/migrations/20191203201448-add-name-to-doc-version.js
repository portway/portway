module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.addColumn('DocumentVersions', 'name', Sequelize.STRING)])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn('DocumentVersions', 'name')])
  }
}
