import BusinessUser from '../businesstime/user'
import BusinessOrganization from '../businesstime/organization'
import tokenIntegrator from '../integrators/token'
import passwordResetKey from '../libs/passwordResetKey'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'

async function createUserAndOrganization(name, email) {
  const organizationName = `${name}'s Organization`
  const organization = await BusinessOrganization.create({ name: organizationName })
  const resetKey = passwordResetKey.generate()

  const createdUser = await BusinessUser.create({
    name,
    email,
    orgId: organization.id,
    orgRoleId: ORGANIZATION_ROLE_IDS.OWNER,
    resetKey
  })

  await BusinessOrganization.updateById(organization.id, { ownerId: createdUser.id })

  const token = tokenIntegrator.generatePasswordResetToken(createdUser.id, resetKey)
  return token
}

export default {
  createUserAndOrganization
}
