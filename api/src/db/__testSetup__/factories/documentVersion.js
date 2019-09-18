import faker from 'faker'
import { getDb } from '../../dbConnector'
import constants from '../constants'

const getDocumentVersionData = function(override = {}) {
  const defaultProps = {
    id: faker.random.number(),
    documentId: faker.random.number(),
    orgId: constants.ORG_ID,
    versionNumber: faker.random.number()
  }
  return { ...defaultProps, ...override }
}

const createMany = async function(numberOfDocumentVersions, override) {
  const db = getDb()
  const documentVersions = Array(numberOfDocumentVersions).fill().map(() => getDocumentVersionData(override))

  return Promise.all(documentVersions.map((projectData) => {
    return db.model('DocumentVersion').create(projectData)
  }))
}

export default {
  createMany
}