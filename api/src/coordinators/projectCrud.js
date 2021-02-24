import BusinessProject from '../businesstime/project'
import BusinessProjectUser from '../businesstime/projectuser'
import documentCoordinator from './document'
import { PROJECT_ROLE_IDS } from '../constants/roles'

const createProject = async (projectBody, creatorUserId, orgId) => {
  const project = await BusinessProject.create(projectBody)
  await BusinessProjectUser.addUserIdToProject(
    creatorUserId,
    project.id,
    PROJECT_ROLE_IDS.ADMIN,
    orgId
  )
  return project
}

const deleteById = async (projectId, orgId) => {

  await BusinessProjectUser.removeAllUsersFromProject(projectId, orgId)
  await documentCoordinator.deleteAllForProject(projectId, orgId)
  await BusinessProject.deleteById(projectId, orgId)
}

export default {
  createProject,
  deleteById
}
