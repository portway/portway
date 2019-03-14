const TODAY = new Date()

const bulkUsers = [{
  firstName: 'Bonkey Jr.',
  lastName: 'Bong',
  email: 'bonkey@bong.com',
  createdAt: TODAY,
  updatedAt: TODAY,
  // password is "bonkeybong"
  password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm'
},
{
  firstName: 'Biddy',
  lastName: 'Bong',
  email: 'biddy@bong.com',
  createdAt: TODAY,
  updatedAt: TODAY,
  // password is "bonkeybong"
  password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm'
},
{
  firstName: 'Baddy',
  lastName: 'Bong',
  email: 'baddy@bong.com',
  createdAt: TODAY,
  updatedAt: TODAY,
  // password is "bonkeybong"
  password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm'
},
{
  firstName: 'Bixie',
  lastName: 'Bong',
  email: 'bixie@bong.com',
  createdAt: TODAY,
  updatedAt: TODAY,
  // password is "bonkeybong"
  password: '$2b$11$5m72f3Gm/diJeP9pFRYdeuSsY64r.xzoJHCUG4iStTHbuPnNE7onm'
}]

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
    return queryInterface.bulkInsert('Users', bulkUsers, {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Users', { email: { $in: bulkUsers.map(user => user.email) } }, {})
  }
}
