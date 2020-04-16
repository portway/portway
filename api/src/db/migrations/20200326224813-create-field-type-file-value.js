module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FieldTypeFileValues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orgId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Organizations',
          key: 'id'
        }
      },
      value: {
        type: Sequelize.TEXT
      },
      fieldId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Fields',
          key: 'id' // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('FieldTypeFileValues')
  }
}
