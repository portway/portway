import { PROJECT_SETTINGS_ROLE_IDS, PROJECT_SETTINGS_ROLES } from '../../constants/roles'

export default function(project) {
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
      return PROJECT_SETTINGS_ROLES[PROJECT_SETTINGS_ROLE_IDS.READER]
    }
    case 'write': {
      return PROJECT_SETTINGS_ROLES[PROJECT_SETTINGS_ROLE_IDS.CONTRIBUTOR]
    }
    default:
      return {}
  }
}