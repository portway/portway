
const TODAY = new Date()

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Documents',
      [
        {
          id: 888,
          orgId: 1,
          projectId: 1,
          name: 'BonkeyDoc1',
          createdAt: TODAY,
          updatedAt: TODAY
        },
        {
          id: 889,
          orgId: 1,
          projectId: 1,
          name: 'BonkeyDoc2',
          createdAt: TODAY,
          updatedAt: TODAY
        },
        {
          id: 890,
          orgId: 1,
          projectId: 1,
          name: 'BonkeyDoc3',
          createdAt: TODAY,
          updatedAt: TODAY
        },
        {
          id: 891,
          orgId: 1,
          projectId: 2,
          name: 'Scenic Trails Overview',
          createdAt: TODAY,
          updatedAt: TODAY
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Documents', null, {})
  }
}
