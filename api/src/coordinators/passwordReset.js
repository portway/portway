import BusinessUser from '../businesstime/user'
import tokenIntegrator from '../integrators/token'
import passwordResetKey from '../libs/passwordResetKey'
import { sendSingleRecipientEmail } from '../integrators/email'
import ono from 'ono'
import passwords from '../libs/passwords'

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

  const htmlBody = `
    <h2>Reset your Portway Password</h2>
    <p>Someone - hopefully you - requested a password reset on this account. If it wasn’t you, you can ignore this email.</p>
    <p>Follow this link to reset your password:</p>
    <a href=${linkUrl}> Click Here</a>
  `
  const textBody = `Here is your link to reset your password: ${linkUrl}`

  const subject = 'Portway password reset'

  await sendSingleRecipientEmail({ address: existingUser.email, htmlBody, textBody, subject })
}

async function setNewPassword(id, password) {
  if (!password) {
    throw ono({ code: 400 }, 'A valid password must be provided')
  }

  const user = await BusinessUser.findById(id)
  if (!user) {
    throw ono({ code: 404 }, `No user found with id: ${id}`)
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
