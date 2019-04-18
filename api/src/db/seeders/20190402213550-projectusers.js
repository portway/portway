const seedIds = require('../config/seedIds')
const TODAY = new Date()
const { BONKEY_PROJECT_ID, SCENIC_PROJECT_ID, ELEMENT_X_PROJECT_ID, BONKEY_ORG_ID, PROJEXT_X_ORG_ID } = seedIds

const projectUsers = [
  {
    orgId: BONKEY_ORG_ID,
    createdAt: TODAY,
    updatedAt: TODAY,
    projectId: BONKEY_PROJECT_ID,
    userId: seedIds.BONKEY_USER_ID,
    roleId: 1
  },
  {
    orgId: BONKEY_ORG_ID,
    createdAt: TODAY,
    projectId: BONKEY_PROJECT_ID,
    userId: seedIds.BIDDY_USER_ID,
    roleId: 1
  },
  {
    orgId: BONKEY_ORG_ID,
    createdAt: TODAY,
    projectId: SCENIC_PROJECT_ID,
    userId: seedIds.BADDY_USER_ID,
    roleId: 2
  },
  {
    orgId: BONKEY_ORG_ID,
    createdAt: TODAY,
    projectId: SCENIC_PROJECT_ID,
    userId: seedIds.BIXIE_USER_ID,
    roleId: 3
  },
  {
    orgId: PROJEXT_X_ORG_ID,
    createdAt: TODAY,
    projectId: ELEMENT_X_PROJECT_ID,
    userId: seedIds.BOB_X_USER_ID,
    roleId: 3
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
seedIds.BOB_X_USER_ID