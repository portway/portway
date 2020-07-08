import faker from 'faker'
import { getDb } from '../../dbConnector'
import constants from '../constants'

const getDocumentData = function(override = {}) {
  const defaultProps = {
    name: faker.random.word(),
    slug: faker.random.word(),
    orgId: constants.ORG_ID,
    projectId: faker.random.number()
  }
  return { ...defaultProps, ...override }
}

const createMany = async function(numberOfDocuments, override) {
  const db = getDb()
  const projects = Array(numberOfDocuments).fill().map(() => getDocumentData(override))

  return Promise.all(projects.map((projectData) => {
    return db.model('Document').create(projectData)
  }))
}

export default {
  createMany
}