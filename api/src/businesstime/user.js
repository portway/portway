import { getDb } from '../db/db-connector'

async function findByEmail(email) {
  const db = getDb()
  const user = await db.model('User').findOne({ where: { email } })

  return user && user.get({ plain: true })
}

export default {
  findByEmail
}