import { connect, loadModels, getDb } from './db-connector'

afterAll(() => {
  const db = getDb()
  db && db.close()
})

export default async function() {
  await connect({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db: process.env.DB_NAME
  })

  await loadModels()

  const db = getDb()

  await db.truncate()
}