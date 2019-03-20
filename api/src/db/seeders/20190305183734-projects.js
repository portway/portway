const TODAY = new Date()

const bulkProjects = [
  {
    name: 'BonkeyBong',
    createdAt: TODAY,
    updatedAt: TODAY,
    orgId: 1
  },
  {
    name: 'Scenic Trails',
    createdAt: TODAY,
    updatedAt: TODAY,
    orgId: 1
  },
  {
    name: 'The Secret of Life',
    createdAt: TODAY,
    updatedAt: TODAY,
    orgId: 2
  },
  {
    name: 'Element X',
    createdAt: TODAY,
    updatedAt: TODAY,
    orgId: 2
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
    return queryInterface.bulkDelete('Projects', { name: { $in: bulkProjects.map(project => project.name) } }, {})
  }
}
