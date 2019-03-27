const seedIds = require('../config/seedIds')

const TODAY = new Date()
const ORG_ID = seedIds.BONKEY_ORG_ID
const BONKEY_PROJECT_ID = seedIds.BONKEY_PROJECT_ID

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Documents',
      [
        {
          id: seedIds.BONKEY_DOC_1_ID,
          orgId: ORG_ID,
          projectId: BONKEY_PROJECT_ID,
          name: 'BonkeyDoc1',
          createdAt: TODAY,
          updatedAt: TODAY
        },
        {
          id: seedIds.BONKEY_DOC_2_ID,
          orgId: ORG_ID,
          projectId: BONKEY_PROJECT_ID,
          name: 'BonkeyDoc2',
          createdAt: TODAY,
          updatedAt: TODAY
        },
        {
          id: seedIds.BONKEY_DOC_3_ID,
          orgId: ORG_ID,
          projectId: BONKEY_PROJECT_ID,
          name: 'BonkeyDoc3',
          createdAt: TODAY,
          updatedAt: TODAY
        },
        {
          id: seedIds.SCENIC_DOC_1_ID,
          orgId: ORG_ID,
          projectId: seedIds.SCENIC_PROJECT_ID,
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
