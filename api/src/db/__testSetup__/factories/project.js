import faker from 'faker'
import { getDb } from '../../dbConnector'
import constants from '../constants'

const getProjectData = function(override = {}) {
  const defaultProps = {
    name: faker.random.word(),
    orgId: constants.ORG_ID
  }
  return { ...defaultProps, ...override }
}

const createMany = async function(numberOfProjects, override) {
  const db = getDb()
  const projects = Array(numberOfProjects).fill().map(() => getProjectData(override))
  return Promise.all(projects.map(projectData => db.model('Project').create(projectData)))
}

export default {
  createMany
}