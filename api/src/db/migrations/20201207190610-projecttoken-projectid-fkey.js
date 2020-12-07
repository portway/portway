'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeConstraint(
        'ProjectTokens',
        'ProjectTokens_projectId_fkey',
        { transaction }
      );
      await queryInterface.addConstraint('ProjectTokens', ['projectId'], {
        type: 'foreign key',
        name: 'ProjectTokens_projectId_fkey',
        references: {
          table: 'Projects',
          field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        transaction
      });
      return transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'ProjectTokens',
        'ProjectTokens_projectId_fkey',
        { transaction }
      );
      await queryInterface.addConstraint('ProjectTokens', ['projectId'], {
        type: 'foreign key',
        name: 'ProjectTokens_projectId_fkey',
        references: {
          table: 'Projects',
          field: 'id',
        },
        transaction
      });
      return transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
};