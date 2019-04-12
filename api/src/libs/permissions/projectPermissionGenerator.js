import BusinessProject from '../../businesstime/project'
import resourceTypes from '../../constants/resourceTypes'
import actions from '../../constants/actions'

export default async function(projectId, orgId) {
  const project = await BusinessProject.findById(
    projectId,
    orgId
  )
  // If there's no project, there are no permissions
  if (!project) {
    return {}
  }

  // TODO: update this with appropriate project setting/constants
  // when the field is added! For now, org users get read access
  // to all projects
  project.accessLevel = 'read'

  switch (project.accessLevel) {
    case 'read': {
      return {
        [resourceTypes.PROJECT]: {
          [actions.READ]: true,
          [actions.LIST]: true
        },
        [resourceTypes.DOCUMENT]: {
          [actions.READ]: true,
          [actions.LIST]: true
        }
      }
    }
    case 'write': {
      return {
        [resourceTypes.PROJECT]: {
          [actions.READ]: true,
          [actions.LIST]: true,
          [actions.UPDATE]: true
        },
        [resourceTypes.DOCUMENT]: {
          [actions.READ]: true,
          [actions.LIST]: true,
          [actions.CREATE]: true,
          [actions.DELETE]: true,
          [actions.UPDATE]: true
        }
      }
    }
    default:
      return {}
  }
}