module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('OrganizationResourceUsage', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orgId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Organizations',
          key: 'id'
        }
      },
      resourceType: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      value: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('OrganizationResourceUsage')
  }
}
