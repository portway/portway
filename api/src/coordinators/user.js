import passwords from '../libs/passwords'
import BusinessUser from '../businesstime/user'
import ono from 'ono'

async function updatePassword(email, password) {
  const hashedPassword = await passwords.generateHash(password)
  await BusinessUser.updateByEmail(email, { password: hashedPassword })
}

async function validateEmailPasswordCombo(email, password) {
  const user = await BusinessUser.findByEmail(email)

  if (!user) throw ono({ code: 404 }, `No user found with email: ${email}`)

  const valid = await passwords.validatePassword(password, user.password)

  if (!valid) throw ono({ code: 401 }, `Invalid Email/Password combination for email: ${email}`)

  return user
}

export default {
  updatePassword,
  validateEmailPasswordCombo
}