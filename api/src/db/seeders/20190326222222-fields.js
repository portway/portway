const seedIds = require('../config/seedIds')

const TODAY = new Date()
const ORG_ID = seedIds.BONKEY_ORG_ID

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Fields',
      [
        {
          name: 'Bonkey',
          type: 1,
          // eslint-disable-next-line no-multi-str
          value: '# Wee Bonkey \
                  a strapping young lass \
                  **a heart of gold** \
                  _ah yes, wee bonkey_',
          orgId: ORG_ID,
          documentId: seedIds.BONKEY_DOC_1_ID,
          createdAt: TODAY,
          updatedAt: TODAY
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Fields', null, {})
  }
}
