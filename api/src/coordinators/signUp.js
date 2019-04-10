import BusinessUser from '../businesstime/user'
import BusinessOrganization from '../businesstime/organization'
import tokenIntegrator from '../integrators/token'
import passwordResetKey from '../libs/passwordResetKey'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'

async function createUserAndOrganization(firstName, lastName, email) {
  const organizationName = `${firstName} ${lastName}'s Organization`
  const organization = await BusinessOrganization.create({ name: organizationName })
  const resetKey = passwordResetKey.generate()

  const createdUser = await BusinessUser.create({
    firstName,
    lastName,
    email,
    orgId: organization.id,
    orgRoleId: ORGANIZATION_ROLE_IDS.ADMIN,
    resetKey
  })

  await BusinessOrganization.updateById(organization.id, { ownerId: createdUser.id })

  const token = tokenIntegrator.generatePasswordResetToken(createdUser.id, resetKey)
  return token
}

export default {
  createUserAndOrganization
}
