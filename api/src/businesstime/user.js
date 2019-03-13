import { getDb } from '../db/db-connector'
import ono from 'ono'

const MODEL_NAME = 'User'

async function findByEmail(email) {
  const db = getDb()
  const user = await db.model(MODEL_NAME).findOne({ where: { email } })

  return user && user.get({ plain: true })
}

async function updateByEmail(email, body) {
  const db = getDb()

  const user = await db.model(MODEL_NAME).findOne({ where: { email } })

  if (!user) throw ono({ code: 404 }, `Cannot update, user not found with email: ${email}`)

  return await user.update(body, { raw: true })
}

export default {
  findByEmail,
  updateByEmail,
}