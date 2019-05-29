import ono from 'ono'

import passwords from '../libs/passwords'
import BusinessUser from '../businesstime/user'
import BusinessProjectUser from '../businesstime/projectuser'
import BusinessOrganization from '../businesstime/organization'
import passwordResetKey from '../libs/passwordResetKey'
import tokenIntegrator from '../integrators/token'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import { pick } from '../libs/utils'
import { sendSingleRecipientEmail } from '../integrators/email'

const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.USER]

const { CLIENT_URL } = process.env

// TODO: do we want this by id instead?
async function updatePassword(email, password) {
  const hashedPassword = await passwords.generateHash(password)
  await BusinessUser.updateByEmail(email, {
    password: hashedPassword
  })
}

async function setInitialPassword(id, password) {
  if (!password) {
    throw ono({ code: 400 }, 'A valid password must be provided')
  }

  const user = await BusinessUser.findById(id)
  if (!user) {
    throw ono({ code: 404 }, `No user found with id: ${id}`)
  }
  if (user.password) {
    throw ono({ code: 409 }, 'Cannot set initial password, user already has one')
  }
  const hashedPassword = await passwords.generateHash(password)
  await BusinessUser.updateById(user.id, {
    password: hashedPassword,
    resetKey: null
  })

  const token = tokenIntegrator.generateToken(user.id, user.orgRoleId, user.orgId)

  return token
}

async function validateEmailPasswordCombo(email, password) {
  const user = await BusinessUser.findByEmail(email)
  if (!user) {
    throw ono({ code: 404 }, `No user found with email: ${email}`)
  }
  const valid = await passwords.validatePassword(password, user.password)
  if (!valid) throw ono({ code: 401 }, `Invalid Email/Password combination for email: ${email}`)
  return user
}

async function validatePasswordResetKey(userId, resetKey) {
  const user = await BusinessUser.findById(userId)
  if (!user) {
    throw ono({ code: 404 }, `No user found with id: ${userId}`)
  }
  if (user.resetKey !== resetKey) {
    throw ono({ code: 401 }, `Password reset key does not match user key`)
  }
  return user
}

async function createPendingUser(email, name, orgId) {
  const resetKey = passwordResetKey.generate()
  const createdUser = await BusinessUser.create({
    email,
    name,
    orgRoleId: ORGANIZATION_ROLE_IDS.USER,
    orgId,
    resetKey
  })

  const organization = await BusinessOrganization.findSanitizedById(orgId)

  const token = tokenIntegrator.generatePasswordResetToken(createdUser.id, resetKey)

  const linkUrl = `http://${CLIENT_URL}/sign-up/registration/complete?token=${token}`

  const invitedText = `You've been invited to join ${organization.name} on Project Danger!`
  const linkText = `Use the following link to complete your registration:`
  const htmlBody = `
    <H2>${invitedText}</h2>
    <H3>${linkText}</h3>
    <div>${linkUrl}</div>
  `
  const textBody = `${invitedText}\n${linkText}\n${linkUrl}`
  const subject = `Project Danger Invitation`

  await sendSingleRecipientEmail({ address: createdUser.email, htmlBody, textBody, subject })

  return pick(createdUser, PUBLIC_FIELDS)
}

async function deleteById(userId, orgId) {
  await BusinessUser.deleteById(userId, orgId)
  await BusinessProjectUser.removeAllProjectAssignmentsForUser(userId, orgId)
}

export default {
  updatePassword,
  setInitialPassword,
  validateEmailPasswordCombo,
  validatePasswordResetKey,
  createPendingUser,
  deleteById
}
