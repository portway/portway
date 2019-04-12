import actions from './actions'
import resourceTypes from './resourceTypes'

export const ORGANIZATION_ROLE_IDS = {
  OWNER: 1,
  ADMIN: 2,
  USER: 3
}

const rIds = ORGANIZATION_ROLE_IDS

export const ORGANIZATION_ROLES = {
  [rIds.OWNER]: {
    [resourceTypes.PROJECT_USER]: {
      [actions.UPDATE]: true,
      [actions.DELETE]: true,
      [actions.READ]: true,
      [actions.LIST]: true
    }
  },
  [rIds.ADMIN]: {
    [resourceTypes.PROJECT_USER]: {
      [actions.UPDATE]: true,
      [actions.DELETE]: true,
      [actions.READ]: true,
      [actions.LIST]: true
    }
  },
  [rIds.USER]: {}
}