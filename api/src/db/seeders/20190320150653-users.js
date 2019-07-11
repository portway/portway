const seedIds = require('../config/seedIds')

const TODAY = new Date()
const ORG_ID = seedIds.BONKEY_ORG_ID
const PROJ_X_ORG_ID = seedIds.PROJEXT_X_ORG_ID

const bulkUsers = [
  {
    id: seedIds.BONKEY_USER_ID,
    name: 'Bonkey Bong Jr.',
    email: 'bonkey@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: ORG_ID,
    orgRoleId: 1
  },
  {
    id: seedIds.BIDDY_USER_ID,
    name: 'Biddy Bong',
    email: 'biddy@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: ORG_ID,
    orgRoleId: 2
  },
  {
    id: seedIds.BADDY_USER_ID,
    name: 'Baddy Bong',
    email: 'baddy@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: ORG_ID,
    orgRoleId: 3
  },
  {
    id: seedIds.BIXIE_USER_ID,
    name: 'Bixie Bong',
    email: 'bixie@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: ORG_ID,
    orgRoleId: 3
  },
  {
    id: seedIds.CAROL_X_USER_ID,
    name: 'Carol X',
    email: 'carolx@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: PROJ_X_ORG_ID,
    orgRoleId: 1
  },
  {
    id: seedIds.BOB_X_USER_ID,
    name: 'Bob X',
    email: 'bobx@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: PROJ_X_ORG_ID,
    orgRoleId: 3
  }
// Create generic reader users for lists
].concat(Array(40).fill().map((__, index) => {
  return {
    id: 10000000 + index,
    name: `Reader ${index}`,
    email: `reader${index}@bong.com`,
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: ORG_ID,
    orgRoleId: 3
  }
}))

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
