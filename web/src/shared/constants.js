const FIELD_TYPES = {
  STRING: 1,
  TEXT: 2,
  NUMBER: 3
}

const PROJECT_ROLE_IDS = {
  ADMIN: 1,
  CONTRIBUTOR: 2,
  READER: 3
}

const ORGANIZATION_ROLE_IDS = {
  OWNER: 1,
  ADMIN: 2,
  USER: 3
}

const PROJECT_ROLE_NAMES = {
  [PROJECT_ROLE_IDS.ADMIN]: 'Admin',
  [PROJECT_ROLE_IDS.CONTRIBUTOR]: 'Contributor',
  [PROJECT_ROLE_IDS.READER]: 'Reader'
}

// Note: This is so we can use this webpack as well, don't convert this to ES6
module.exports = {
  PRODUCT_NAME: 'Project Danger',
  PRODUCT_ID: 'project-danger',
  PRODUCT_LOGO: '/images/logo.svg',
  // Default text strings
  LABEL_NEW_DOCUMENT: 'New Document',
  // Paths
  PATH_APP: '/d',
  PATH_BILLING: '/billing',
  PATH_DASHBOARD: '/dashboard',
  PATH_DOCUMENT: '/document',
  PATH_LOGOUT: '/logout',
  PATH_PROJECT: '/project',
  PATH_PROJECTS: '/projects',
  PATH_PROJECT_CREATE: '/project/create',
  PATH_SETTINGS: '/settings',
  MAX_COOKIE_AGE_MS: '604800000', // 7 days
  FIELD_LABELS: {
    [FIELD_TYPES.STRING]: 'text-field-',
    [FIELD_TYPES.TEXT]: 'text-area-',
    [FIELD_TYPES.NUMBER]: 'number-'
  },
  FIELD_TYPES: FIELD_TYPES,
  PROJECT_ROLE_IDS: PROJECT_ROLE_IDS,
  PROJECT_ROLE_NAMES: PROJECT_ROLE_NAMES,
  ORGANIZATION_ROLE_IDS: ORGANIZATION_ROLE_IDS
}
