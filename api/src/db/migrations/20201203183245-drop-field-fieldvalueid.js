'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Fields', 'fieldValueId')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Fields', 'fieldValueId', { type: Sequelize.INTEGER })
  }
};
