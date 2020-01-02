
const db = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.DB_USE_SSL === 'true'
  },
  operatorsAliases: false
}

module.exports = {
  development: db,
  test: db,
  production: db
}
