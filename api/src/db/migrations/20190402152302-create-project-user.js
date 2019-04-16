
const TABLE_NAME = 'ProjectsUsers'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable(TABLE_NAME, {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        projectId: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        userId: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        orgId: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        roleId: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })
      .then(() => {
        return queryInterface.addConstraint(TABLE_NAME, ['userId', 'projectId'], {
          type: 'unique',
          name: 'one_user_assignment_per_project_constraint'
        })
      })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ProjectsUsers')
  }
}