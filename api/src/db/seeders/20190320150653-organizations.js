

const TODAY = new Date()

const bulkOrgs = [
  {
    id: 1,
    name: 'BonkeyBong',
    createdAt: TODAY,
    updatedAt: TODAY
  },
  {
    id: 2,
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
