const seedIds = require('../config/seedIds')

const TODAY = new Date()
const ORG_ID = seedIds.BONKEY_ORG_ID
const PROJ_X_ORG_ID = seedIds.PROJEXT_X_ORG_ID

const bulkProjects = [
  {
    name: 'BonkeyBong',
    createdAt: TODAY,
    updatedAt: TODAY,
    orgId: ORG_ID
  },
  {
    name: 'Scenic Trails',
    createdAt: TODAY,
    updatedAt: TODAY,
    orgId: ORG_ID
  },
  {
    name: 'The Secret of Life',
    createdAt: TODAY,
    updatedAt: TODAY,
    orgId: PROJ_X_ORG_ID
  },
  {
    name: 'Element X',
    createdAt: TODAY,
    updatedAt: TODAY,
    orgId: PROJ_X_ORG_ID
  }
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Projects', bulkProjects)
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete(
      'Projects',
      { name: { [Sequelize.Op.in]: bulkProjects.map(project => project.name) } },
      {}
    )
  }
}
