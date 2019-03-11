import passwords from '../libs/passwords'
import userBusiness from '../businesstime/user'

async function updatePassword(password) {
  const hashedPassword = await passwords.generateHash(password)
  await userBusiness.update({ password: hashedPassword })
}

async function validateEmailPasswordCombo(email, password) {
  const user = await userBusiness.findByEmail(email)

  if (!user) throw new Error(`No user found with email: ${email}`)

  const valid = await passwords.validatePassword(password, user.password)

  if (!valid) throw new Error(`Invalid Email/Password combination for email: ${email}`)

  return user
}

export default {
  updatePassword,
  validateEmailPasswordCombo
}