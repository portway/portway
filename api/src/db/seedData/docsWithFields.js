// To make life easier, a document and its fields can be defined
// in this file and will get created during a sequelize db:seed:all
//
// This makes it easier to create seed data without having
// to manage the value tables for fields and track and define
// ids everywhere
const FIELD_TYPES = require('../config/fieldTypeValues')
const seedIds = require('../config/seedIds')
const BONKEY_PROJECT_ID = seedIds.BONKEY_PROJECT_ID
const BONKEY_ORG_ID = seedIds.BONKEY_ORG_ID

const documents = [
  {
    name: 'BonkeyDoc1',
    orgId: BONKEY_ORG_ID,
    projectId: BONKEY_PROJECT_ID,
    fields: [
      {
        type: FIELD_TYPES.STRING,
        name: 'Bonkey Field Title',
        value: 'This is the title of my Bonkey Doc!'
      },
      {
        type: FIELD_TYPES.NUMBER,
        name: 'Bonkey Field Number',
        value: 15
      },
      {
        type: FIELD_TYPES.TEXT,
        name: 'Bonkey Field Text',
        // eslint-disable-next-line no-multi-str
        value: '# Wee Bonkey \
                  a strapping young lass \
                  **a heart of gold** \
                  _ah yes, wee bonkey_',
        structuredValue: '{ "h1": "Wee Bonkey", "p": "a strapping young lass"}'
      }
    ]
  },
  {
    name: 'BonkeyDoc2',
    orgId: BONKEY_ORG_ID,
    projectId: BONKEY_PROJECT_ID
  },
  {
    name: 'BonkeyDoc3',
    orgId: BONKEY_ORG_ID,
    projectId: BONKEY_PROJECT_ID
  },
  {
    name: 'Scenic Trails Overview',
    orgId: BONKEY_ORG_ID,
    projectId: seedIds.SCENIC_PROJECT_ID
  }
]

module.exports = documents