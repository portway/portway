import actions from './actions'
import resourceTypes from './resourceTypes'

export const ORGANIZATION_ROLE_IDS = {
  OWNER: 1,
  ADMIN: 2,
  USER: 3
}

export const PROJECT_ROLE_IDS = {
  ADMIN: 1,
  CONTRIBUTOR: 2,
  READER: 3
}

// These are the access roles given to a user
// based on the project settings
// Currently tied to PROJECT_ROLE_IDS but can be decoupled
export const PROJECT_SETTINGS_ROLE_IDS = {
  CONTRIBUTOR: PROJECT_ROLE_IDS.CONTRIBUTOR,
  READER: PROJECT_ROLE_IDS.READER
}

const rIds = ORGANIZATION_ROLE_IDS

// Any permission granted to an org role
// means immediate access is granted to that
// resource type and action, with no finer-grained
// checks on permission. If you want fine-grained checks,
// add a resourceHandler to the permissions and DO NOT
// give an org role permission!
export const ORGANIZATION_ROLES = {
  [rIds.OWNER]: {
    [resourceTypes.ORGANIZATION]: {
      [actions.READ_MY]: true,
      [actions.UPDATE_MY]: true
    },
    [resourceTypes.PROJECT]: {
      [actions.LIST]: true,
      [actions.READ]: true,
      [actions.CREATE]: true,
      [actions.LIST_MY]: true
    },
    [resourceTypes.PROJECT_USER]: {
      [actions.UPDATE]: true,
      [actions.DELETE]: true,
      [actions.READ]: true,
      [actions.LIST]: true,
      [actions.CREATE]: true
    },
    [resourceTypes.USER]: {
      [actions.LIST]: true,
      [actions.CREATE]: true,
      [actions.READ]: true,
      [actions.UPDATE]: true,
      [actions.DELETE]: true,
      [actions.UPDATE_ORG_ROLE]: true,
      [actions.READ_MY]: true,
      [actions.UPDATE_MY]: true
    }
  },
  [rIds.ADMIN]: {
    [resourceTypes.ORGANIZATION]: {
      [actions.READ_MY]: true
    },
    [resourceTypes.PROJECT]: {
      [actions.LIST]: true,
      [actions.READ]: true,
      [actions.CREATE]: true,
      [actions.LIST_MY]: true
    },
    [resourceTypes.USER]: {
      [actions.LIST]: true,
      [actions.CREATE]: true,
      [actions.READ]: true,
      [actions.UPDATE_ORG_ROLE]: true,
      [actions.READ_MY]: true,
      [actions.UPDATE_MY]: true
    },
    [resourceTypes.PROJECT_USER]: {
      [actions.UPDATE]: true,
      [actions.DELETE]: true,
      [actions.READ]: true,
      [actions.LIST]: true
    }
  },
  [rIds.USER]: {
    [resourceTypes.ORGANIZATION]: {
      [actions.READ_MY]: true
    },
    [resourceTypes.PROJECT]: {
      [actions.LIST_MY]: true
    },
    [resourceTypes.USER]: {
      [actions.LIST]: true,
      [actions.READ_MY]: true,
      [actions.UPDATE_MY]: true
    }
  }
}

// All project roles are permissions _for an individual project_,
// Project Role permissions only apply to
// a user explicitly assigned the role on an individual project!
export const PROJECT_ROLES = {
  [PROJECT_ROLE_IDS.ADMIN]: {
    [resourceTypes.PROJECT]: {
      [actions.READ]: true,
      [actions.CREATE]: true,
      [actions.DELETE]: true,
      [actions.UPDATE]: true
    },
    [resourceTypes.DOCUMENT]: {
      [actions.READ]: true,
      [actions.LIST]: true,
      [actions.CREATE]: true,
      [actions.DELETE]: true,
      [actions.UPDATE]: true
    },
    [resourceTypes.PROJECT_USER]: {
      [actions.READ]: true,
      [actions.LIST]: true,
      [actions.CREATE]: true,
      [actions.DELETE]: true,
      [actions.UPDATE]: true
    },
    [resourceTypes.PROJECT_TOKEN]: {
      [actions.READ]: true,
      [actions.LIST]: true,
      [actions.CREATE]: true,
      [actions.DELETE]: true,
      [actions.UPDATE]: true
    }
  },
  [PROJECT_ROLE_IDS.CONTRIBUTOR]: {
    [resourceTypes.PROJECT]: {
      [actions.READ]: true,
      [actions.UPDATE]: true
    },
    [resourceTypes.DOCUMENT]: {
      [actions.READ]: true,
      [actions.LIST]: true,
      [actions.CREATE]: true,
      [actions.DELETE]: true,
      [actions.UPDATE]: true
    }
  },
  [PROJECT_ROLE_IDS.READER]: {
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

// Project settings roles currently mirror the corresponding project roles
// but this can be changed at any point with no other code changes
export const PROJECT_SETTINGS_ROLES = {
  [PROJECT_SETTINGS_ROLE_IDS.CONTRIBUTOR]: PROJECT_ROLES[PROJECT_ROLE_IDS.CONTRIBUTOR],
  [PROJECT_SETTINGS_ROLE_IDS.READER]: PROJECT_ROLES[PROJECT_ROLE_IDS.READER]
}
