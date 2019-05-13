import passwords from '../libs/passwords'
import BusinessUser from '../businesstime/user'
import ono from 'ono'
import passwordResetKey from '../libs/passwordResetKey'
import tokenIntegrator from '../integrators/token'

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
    password: hashedPassword
  })
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

async function createPendingUser(email, orgId) {
  const resetKey = passwordResetKey.generate()
  const createdUser = await BusinessUser.create({
    email,
    firstName: email,
    lastName: email,
    orgRoleId: 2,
    orgId,
    resetKey
  })

  const token = tokenIntegrator.generatePasswordResetToken(createdUser.id, resetKey)

  // TODO: email tokenized signup url to user

  //TODO: remove this
  console.info(`http://localhost:3000/sign-up/registration/password?token=${token}`)
}

export default {
  updatePassword,
  setInitialPassword,
  validateEmailPasswordCombo,
  validatePasswordResetKey,
  createPendingUser
}
