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
    name: 'Contact page',
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
        value: `# Wee Bonkey\n
A strapping young lass with **a heart of gold**, _ah yes, wee bonkey_ Dirk is that wee [Bonkey!](https://bonkeybong.com/)\n
1. I am a numbered list
1. With a second list item\n
\`\`\`
// This is some code
(() => {
  console.log('Blah')
})
\`\`\`\n
I am also going to put a bulleted list right here\n
* I am a bullet
* I am a bullet\n
> And I am a multi-line quote that will hopefully wrap to a second line and format correctly
`,
        structuredValue: '{ "h1": "Wee Bonkey", "p": "a strapping young lass"}'
      }
    ]
  },
  {
    name: 'Sample of a document with a very long name for testing',
    orgId: BONKEY_ORG_ID,
    projectId: BONKEY_PROJECT_ID
  },
  {
    name: '🚀 New hotness',
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
