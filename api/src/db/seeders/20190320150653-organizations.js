const seedIds = require('../config/seedIds')

const TODAY = new Date()
const ORG_ID = seedIds.BONKEY_ORG_ID
const PROJ_X_ORG_ID = seedIds.PROJEXT_X_ORG_ID

const bulkOrgs = [
  {
    id: ORG_ID,
    name: 'BonkeyBong',
    createdAt: TODAY,
    updatedAt: TODAY
  },
  {
    id: PROJ_X_ORG_ID,
    name: 'Prestigious Company X',
    createdAt: TODAY,
    updatedAt: TODAY
  }
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Organizations', bulkOrgs)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      'Organizations',
      { name: { $in: bulkOrgs.map(org => org.name) } },
      {}
    )
  }
}
