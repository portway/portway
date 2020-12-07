'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeConstraint(
        'OrganizationResourceUsages',
        'OrganizationResourceUsages_orgId_fkey',
        { transaction }
      );
      await queryInterface.addConstraint('OrganizationResourceUsages', ['orgId'], {
        type: 'foreign key',
        name: 'OrganizationResourceUsages_orgId_fkey',
        references: {
          table: 'Organizations',
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
        'OrganizationResourceUsages',
        'OrganizationResourceUsages_orgId_fkey',
        { transaction }
      );
      await queryInterface.addConstraint('OrganizationResourceUsages', ['orgId'], {
        type: 'foreign key',
        name: 'OrganizationResourceUsages_orgId_fkey',
        references: {
          table: 'Organizations',
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