import Sequelize from 'sequelize'
import path from 'path'
import { modelFilePaths } from './models'

// This is currently just passing the first arg from the sequelize logger,
// the second arg is a pretty-printed object containing sequelize config data for the request
const dbLogger = process.env.LOG_DB_COMMANDS === 'true'
  ? dbCommand => console.info(dbCommand)
  : false

let connectedDb

export async function connect({ user, password, host, port, db }) {
  if (connectedDb) return connectedDb

  const dbUri = `postgres://${user}:${password}@${host}:${port}/${db}`
  console.info(`Connecting to database ${dbUri}`)

  const sequelize = new Sequelize(dbUri, { logging: dbLogger, operatorsAliases: false })

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

export function loadModels() {
  if (!connectedDb) {
    throw new Error('Must have a connected db before loading models')
  }

  modelFilePaths.forEach((file) => {
    connectedDb.import(path.join(__dirname, 'models', file))
  })

  const models = connectedDb.models

  Object.keys(models).forEach((modelName) => {
    const model = connectedDb.model(modelName)
    model.associate && model.associate(models)
  })
}