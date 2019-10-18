const seedIds = require('../config/seedIds')

const TODAY = new Date()
const ORG_ID = seedIds.BONKEY_ORG_ID
const PROJ_X_ORG_ID = seedIds.PROJEXT_X_ORG_ID

const bulkOrgs = [
  {
    id: ORG_ID,
    name: 'BonkeyBong',
    ownerId: seedIds.BONKEY_USER_ID,
    createdAt: TODAY,
    updatedAt: TODAY,
    plan: 'SINGLE_USER',
    subscriptionStatus: 'active',
    stripeId: 'cus_FDJOIxZ9aMzLGX'
  },
  {
    id: PROJ_X_ORG_ID,
    name: 'Prestigious Company X',
    ownerId: seedIds.BOB_X_USER_ID,
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
      { name: { [Sequelize.Op.in]: bulkOrgs.map(org => org.name) } },
      {}
    )
  }
}
