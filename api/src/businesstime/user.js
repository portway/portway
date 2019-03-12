import { getDb } from '../db/db-connector'

const MODEL_NAME = 'User'

async function findByEmail(email) {
  const db = getDb()
  const user = await db.model(MODEL_NAME).findOne({ where: { email } })

  return user && user.get({ plain: true })
}

export default {
  findByEmail
}