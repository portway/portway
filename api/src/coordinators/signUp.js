import uuidv1 from 'uuid/v1'

import BusinessUser from '../businesstime/user'
import BusinessOrganization from '../businesstime/organization'
import tokenIntegrator from '../integrators/token'

async function signUp(firstName, lastName, email, password) {
  const organizationName = `${firstName} ${lastName}'s Organization`
  const organization = await BusinessOrganization.create({ name: organizationName })
  const resetKey = uuidv1()

  const createdUser = await BusinessUser.create({
    firstName,
    lastName,
    email,
    orgId: organization.id,
    resetKey
  })

  await BusinessOrganization.updateById(organization.id, { ownerId: createdUser.id })

  const token = tokenIntegrator.generatePasswordResetToken(createdUser.id, resetKey)
  return token
}

export default {
  signUp
}
