import faker from 'faker'
import { getDb } from '../../dbConnector'

const getOrganizationData = function(override = {}) {
  const defaultProps = {
    name: faker.random.word(),
    orgId: 1
  }
  return { ...defaultProps, ...override }
}

const createMany = async function(numberOfOrganizations, override) {
  const db = getDb()
  const organizations = Array(numberOfOrganizations)
    .fill(numberOfOrganizations)
    .map(() => getOrganizationData(override))

  return Promise.all(organizations.map((organizationData) => {
    return db.model('Organization').create(organizationData)
  }))
}

export default {
  createMany
}
