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
    const today = new Date()

    return queryInterface.bulkInsert('Projects', [
      {
        name: 'BonkeyBong',
        createdAt: today,
        updatedAt: today
      },
      {
        name: 'Scenic Trails',
        createdAt: today,
        updatedAt: today
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Projects', null, {})
  }
}
