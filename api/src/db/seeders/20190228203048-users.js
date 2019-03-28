const seedIds = require('../config/seedIds')

const TODAY = new Date()
const ORG_ID = seedIds.BONKEY_ORG_ID
const PROJ_X_ORG_ID = seedIds.PROJEXT_X_ORG_ID

const bulkUsers = [
  {
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
