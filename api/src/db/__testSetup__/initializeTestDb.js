import { connect, loadModels, getDb } from '../dbConnector'

afterAll(() => {
  const db = getDb()
  db && db.close()
})

export const clearDb = async function() {
  const db = getDb()

  await Promise.all(Object.values(db.models).map((model) => {
    return model.destroy({ truncate: true, cascade: true })
  }))
}

export default async function() {
  await connect({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db: process.env.DB_NAME
  })

  await loadModels()
  await clearDb()
}
