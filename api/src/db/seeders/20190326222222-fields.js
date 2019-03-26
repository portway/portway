const TODAY = new Date()

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Fields', [
      {
        name: 'Bonkey',
        type: 1,
        // eslint-disable-next-line no-multi-str
        value: '# Wee Bonkey \
        a strapping young lass \
        **a heart of gold** \
        _ah yes, wee bonkey_',
        orgId: 1,
        documentId: 888,
        createdAt: TODAY,
        updatedAt: TODAY
      }
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Fields', null, {})
  }
}
