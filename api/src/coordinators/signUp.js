import BusinessUser from '../businesstime/user'
import BusinessOrganization from '../businesstime/organization'

async function signUp(firstName, lastName, email, password) {
  const organizationName = `${firstName} ${lastName}'s Organization`
  const organization = await BusinessOrganization.create({ name: organizationName })

  const createdUser = await BusinessUser.create({
    firstName,
    lastName,
    email,
    orgId: organization.id
  })

  await BusinessOrganization.updateById(organization.id, { ownerId: createdUser.id })
}

export default {
  signUp
}
