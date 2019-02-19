import Sequelize from 'sequelize'

let connectedDb

export async function connect({ user, password, host, port, db }) {
  if (connectedDb) return connectedDb

  const dbUri = `postgres://${user}:${password}@${host}:${port}/${db}`

  console.log(dbUri)

  const sequelize = new Sequelize(dbUri)

  try {
    await sequelize.authenticate()
  } catch (err) {
    console.error(err)
    throw new Error('Unable to connect to the database:', err)
  }

  connectedDb = sequelize

  return connectedDb
}

export function getDb() {
  if (!connectedDb) {
    throw new Error('You must call connect() before using db')
  }
  return connectedDb
}
