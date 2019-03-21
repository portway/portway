const TODAY = new Date()

const bulkUsers = [
  {
    firstName: 'Bonkey Jr.',
    lastName: 'Bong',
    email: 'bonkey@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: 1
  },
  {
    firstName: 'Biddy',
    lastName: 'Bong',
    email: 'biddy@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: 1
  },
  {
    firstName: 'Baddy',
    lastName: 'Bong',
    email: 'baddy@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: 1
  },
  {
    firstName: 'Bixie',
    lastName: 'Bong',
    email: 'bixie@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: 1
  },
  {
    firstName: 'Carol',
    lastName: 'X',
    email: 'carolx@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: 2
  },
  {
    firstName: 'Bob',
    lastName: 'X',
    email: 'bobx@bong.com',
    createdAt: TODAY,
    updatedAt: TODAY,
    // password is "bonkeybong"
    password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm',
    orgId: 2
  }
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', bulkUsers, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      'Users',
      { email: { $in: bulkUsers.map(user => user.email) } },
      {}
    )
  }
}
