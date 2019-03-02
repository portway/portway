import { getDb } from '../db/db-connector'
import passwords from '../libs/passwords'

async function findByEmail(email) {
  const db = getDb()
  const user = await db.model('User').findOne({ where: { email } })
  return user
}

async function setPassword(user, password) {
  const hashedPassword = await passwords.generateHash(password)
  user.set('password', hashedPassword)
}

async function validatePassword(user, password) {
  const valid = await passwords.validatePassword(password, user.get('password'))
  return valid
}

export default {
  findByEmail,
  setPassword,
  validatePassword
}