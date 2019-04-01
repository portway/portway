// This is a repeat of the constants file fieldTypes.js definition
// Because sequelize db seeders don't allow es6 import/export syntax,
// need to define this just for seed data.
//
// DO NOT USE FOR APPLICATION LOGIC!!!!!!
//
// Use api/src/constants/fieldTypes.js !!!!!!!!!
const FIELD_TYPES = {
  STRING: 1,
  TEXT: 2,
  NUMBER: 3
}

module.exports = FIELD_TYPES