'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeConstraint(
        'Fields',
        'Fields_documentId_fkey',
        { transaction }
      );
      await queryInterface.addConstraint('Fields', ['documentId'], {
        type: 'foreign key',
        name: 'Fields_documentId_fkey',
        references: {
          table: 'Documents',
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
        'Fields',
        'Fields_documentId_fkey',
        { transaction }
      );
      await queryInterface.addConstraint('Fields', ['documentId'], {
        type: 'foreign key',
        name: 'Fields_documentId_fkey',
        references: {
          table: 'Documents',
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