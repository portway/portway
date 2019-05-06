import { PROJECT_SETTINGS_ROLE_IDS, PROJECT_SETTINGS_ROLES } from '../../constants/roles'
import PROJECT_ACCESS_LEVELS from '../../constants/projectAccessLevels'

export default function(project) {
  // If there's no project, there are no permissions
  if (!project) {
    return {}
  }

  switch (project.accessLevel) {
    case PROJECT_ACCESS_LEVELS.READ: {
      return PROJECT_SETTINGS_ROLES[PROJECT_SETTINGS_ROLE_IDS.READER]
    }
    case PROJECT_ACCESS_LEVELS.WRITE: {
      return PROJECT_SETTINGS_ROLES[PROJECT_SETTINGS_ROLE_IDS.CONTRIBUTOR]
    }
    default:
      return {}
  }
}