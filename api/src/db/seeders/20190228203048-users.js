const seedIds = require('../config/seedIds')

const TODAY = new Date()
const ORG_ID = seedIds.BONKEY_ORG_ID
const PROJ_X_ORG_ID = seedIds.PROJEXT_X_ORG_ID

const bulkUsers = [
  {
    id: seedIds.BONKEY_USER_ID,
    firstName: 'Bonkey Jr.',
    lastName: 'Bong',
    email: 'bonkey@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: ORG_ID
  },
  {
    id: seedIds.BIDDY_USER_ID,
    firstName: 'Biddy',
    lastName: 'Bong',
    email: 'biddy@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: ORG_ID
  },
  {
    id: seedIds.BADDY_USER_ID,
    firstName: 'Baddy',
    lastName: 'Bong',
    email: 'baddy@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: ORG_ID
  },
  {
    id: seedIds.BIXIE_USER_ID,
    firstName: 'Bixie',
    lastName: 'Bong',
    email: 'bixie@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: ORG_ID
  },
  {
    id: seedIds.CAROL_X_USER_ID,
    firstName: 'Carol',
    lastName: 'X',
    email: 'carolx@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: PROJ_X_ORG_ID
  },
  {
    id: seedIds.BOB_X_USER_ID,
    firstName: 'Bob',
    lastName: 'X',
    email: 'bobx@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: PROJ_X_ORG_ID
  }
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', bulkUsers, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      'Users',
      { email: { [Sequelize.Op.in]: bulkUsers.map(user => user.email) } },
      {}
    )
  }
}
