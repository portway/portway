import { connect, loadModels, getDb } from '../dbConnector'
import { ORG_ID, ORG_2_ID } from './constants'

afterAll(async () => {
  const db = getDb()
  if (db) {
    await db.close()
  }
})

export const clearDb = async function() {
  const db = getDb()

  //delete

  await Promise.all(Object.values(db.models).map((model) => {
    return model.destroy({ truncate: true, cascade: true, force: true })
  }))
  // after clearing out the db, reset test orgs used by all tests
  await setupTestOrgs()
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

const setupTestOrgs = async function() {
  const db = getDb()
  await db.model('Organization').bulkCreate([
    { name: 'org_1', id: ORG_ID },
    { name: 'org_2', id: ORG_2_ID }
  ], {
    ignoreDuplicates: true
  })
}
