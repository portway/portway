import Sequelize from 'sequelize'

let connectedDb

export function connect({ user, password, host, port, db }) {
  connectedDb = new Sequelize(
    `postgres://${user}:${password}@${host}:${port}/${db}`
  )
}

export function getDb() {
  if (!connectedDb) {
    throw new Error('You must call connect() before using db')
  }
  return connectedDb
}
