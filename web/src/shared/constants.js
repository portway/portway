const FIELD_TYPES = {
  STRING: 1,
  TEXT: 2,
  NUMBER: 3
}

const ROLE_IDS = {
  ADMIN: 1,
  CONTRIBUTOR: 2,
  READER: 3
}

const ROLE_NAMES = {
  [ROLE_IDS.ADMIN]: 'Admin',
  [ROLE_IDS.CONTRIBUTOR]: 'Contributor',
  [ROLE_IDS.READER]: 'Reader'
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
  ROLE_IDS: ROLE_IDS,
  ROLE_NAMES: ROLE_NAMES
}
