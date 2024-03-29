import ono from 'ono'

import passwords from '../libs/passwords'
import BusinessUser from '../businesstime/user'
import BusinessProjectUser from '../businesstime/projectuser'
import passwordResetKey from '../libs/passwordResetKey'
import tokenIntegrator from '../integrators/token'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import { AVATAR_URLS } from '../constants/avatars'
import { pick } from '../libs/utils'
import emailCoordinator from '../coordinators/email'
import billingCoordinator from './billing'
import slackIntegrator from '../integrators/slack'
import mailchimpIntegrator from '../integrators/mailchimp'

const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.USER]

async function updatePassword(userId, currentPassword, newPassword, confirmNewPassword, orgId) {
  if (newPassword !== confirmNewPassword) {
    throw ono({ code: 409, errorDetails: [{ key: 'confirmNewPassword', message: 'New password does not match confirmation password' }] }, 'New password does not match confirmation password')
  }

  const user = await BusinessUser.findById(userId)
  if (!user) {
    throw ono({ code: 404 }, `No user found with id: ${userId}`)
  }

  const valid = await passwords.validatePassword(currentPassword, user.password)
  if (!valid) throw ono({ code: 400, errorDetails: [{ key: 'password', message: 'Incorrect Password' }] }, `Password Error`)

  const hashedPassword = await passwords.generateHash(newPassword)

  await BusinessUser.updateById(userId, { password: hashedPassword }, orgId)

  emailCoordinator.sendPasswordChangeEmail(user.email)
}

async function setInitialPassword(id, password, joinNewsletter = false) {
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
  await BusinessUser.updateById(
    user.id,
    {
      password: hashedPassword,
      resetKey: null
    },
    user.orgId)

  const token = tokenIntegrator.generateToken(user.id, user.orgRoleId, user.orgId)

  // not awaiting this, sends a notification to slack channel
  slackIntegrator.sendNotification(`${user.email} has verified their account`)

  // join the mailchimp list if user selected
  if (joinNewsletter) {
    mailchimpIntegrator.joinList(user.email, user.name)
  }

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
    throw ono({ code: 403 }, `Password reset key does not match user key`)
  }
  return user
}

async function createOrgUser(email, name, orgId) {
  // look up number of org seats and number of current users,
  // make sure org isn't maxed out
  const orgBilling = await billingCoordinator.getOrgBilling(orgId)

  if (!orgBilling.subscription) {
    const publicMessage = 'No Subscription: Organization must be subscribed to a plan before adding users'
    throw ono({ code: 409, errorDetails: [{ key: 'users', message: publicMessage }] }, publicMessage)
  }

  const { totalSeats, usedSeats } = orgBilling.subscription

  // if subscription doesn't have seats set up, or user count is equal to total seats, throw an error
  if (totalSeats == null || usedSeats >= totalSeats) {
    const publicMessage = 'Cannot create user, all available seats have been used'
    throw ono({ code: 409, errorDetails: [{ key: 'users', message: publicMessage }] }, publicMessage)
  }

  const user = await userCoordinator.createPendingUser(email, name, orgId)
  const token = tokenIntegrator.generatePasswordResetToken(user.id, user.resetKey)
  await emailCoordinator.sendInvitationEmail(user.email, token, orgId)
  return pick(user, PUBLIC_FIELDS)
}

/**
 * ALL user creation should run through this function! It does not check org seats, send invites,
 * or handle any logic beyond creating the user with a resetKey.
 *
 * Note the returned user object will have a resetKey, which can be used to send out invite links etc.
 * @param {String} email
 * @param {String} name
 * @param {String} orgId
 * @param {String} orgRoleId
 * @return {Object} User with resetKey property
 */
async function createPendingUser(
  email,
  name,
  orgId,
  orgRoleId = ORGANIZATION_ROLE_IDS.USER
) {
  const existingUser = await BusinessUser.findByEmail(email)
  if (existingUser) {
    const publicMessage = 'Cannot create user, this email address is already in use'
    throw ono(
      { code: 409, errorDetails: [{ key: 'users', message: publicMessage }] },
      publicMessage
    )
  }

  const resetKey = passwordResetKey.generate()

  //look for existing soft-deleted user
  const previouslyDeletedUser = await BusinessUser.findSoftDeletedByEmail(email)

  let user

  if (previouslyDeletedUser) {
    user = await BusinessUser.restoreSoftDeleted(
      previouslyDeletedUser.id,
      resetKey,
      orgId,
      ORGANIZATION_ROLE_IDS.USER
    )
  } else {
    user = await BusinessUser.create({
      email,
      name,
      orgRoleId,
      orgId,
      resetKey,
      // eslint-disable-next-line no-bitwise
      avatar: AVATAR_URLS[(Math.random() * AVATAR_URLS.length) | 0] // assign random avatar from list
    })
  }
  // Not a public field, but we return it here so invites can be sent
  user.resetKey = resetKey

  return user
}

async function deleteById(userId, orgId) {
  await BusinessUser.deleteById(userId, orgId)
  await BusinessProjectUser.removeAllProjectAssignmentsForUser(userId, orgId)
}

async function resendInvite(userId, orgId) {
  const resetKey = passwordResetKey.generate()
  const user = await BusinessUser.findSanitizedById(userId, orgId)

  if (!user.pending) {
    throw ono({ code: 404 }, 'Cannot resend a an invite to a non-pending user')
  }

  const updatedUser = await BusinessUser.updateById(userId, { resetKey }, orgId)
  const token = tokenIntegrator.generatePasswordResetToken(updatedUser.id, resetKey)
  await emailCoordinator.sendInvitationEmail(updatedUser.email, token, orgId)
}

const userCoordinator = {
  updatePassword,
  setInitialPassword,
  validateEmailPasswordCombo,
  validatePasswordResetKey,
  createOrgUser,
  createPendingUser,
  deleteById,
  resendInvite
}

export default userCoordinator
