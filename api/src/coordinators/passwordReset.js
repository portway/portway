import BusinessUser from '../businesstime/user'
import tokenIntegrator from '../integrators/token'
import passwordResetKey from '../libs/passwordResetKey'
import ono from 'ono'
import passwords from '../libs/passwords'
import emailCoordinator from './email'

const { CLIENT_URL } = process.env

async function initiatePasswordReset(email) {
  const existingUser = await BusinessUser.findByEmail(email)

  if (!existingUser) {
    throw ono({ code: 409 }, `User not found with email ${email}`)
  }

  const resetKey = passwordResetKey.generate()

  await BusinessUser.updateById(existingUser.id, { resetKey }, existingUser.orgId)

  const token = tokenIntegrator.generatePasswordResetToken(existingUser.id, resetKey)

  const linkUrl = `${CLIENT_URL}/password-reset/complete?token=${token}`

  emailCoordinator.sendPasswordResetEmail(linkUrl, email)
}

async function setNewPassword(userId, password) {
  if (!password) {
    throw ono({ code: 400 }, 'A valid password must be provided')
  }

  const user = await BusinessUser.findById(userId)
  if (!user) {
    throw ono({ code: 404 }, `No user found with id: ${userId}`)
  }

  const hashedPassword = await passwords.generateHash(password)
  await BusinessUser.updateById(
    user.id,
    {
      password: hashedPassword,
      resetKey: null
    },
    user.orgId
  )

  const token = tokenIntegrator.generateToken(user.id, user.orgRoleId, user.orgId)

  return token
}

export default {
  initiatePasswordReset,
  setNewPassword
}
