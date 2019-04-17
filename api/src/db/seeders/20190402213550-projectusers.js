const seedIds = require('../config/seedIds')
const TODAY = new Date()
const { BONKEY_USER_ID, BONKEY_PROJECT_ID, BONKEY_ORG_ID } = seedIds

const projectUsers = [
  {
    orgId: BONKEY_ORG_ID,
    createdAt: TODAY,
    updatedAt: TODAY,
    projectId: BONKEY_PROJECT_ID,
    userId: BONKEY_USER_ID,
    roleId: 1
  }
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ProjectsUsers', projectUsers, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ProjectsUsers', null, {})
  }
}
