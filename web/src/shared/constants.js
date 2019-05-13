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

const PROJECT_ACCESS_LEVELS = {
  READ: 'read',
  WRITE: 'write'
}

const NOTIFICATION_TYPES = {
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning'
}

const NOTIFICATION_RESOURCE = {
  PROJECTS: 'PROJECTS',
  PROJECT: 'PROJECT',
  DOCUMENTS: 'DOCUMENTS',
  DOCUMENT: 'DOCUMENT'
}

// Note: This is so we can use this webpack as well, don't convert this to ES6
module.exports = {
  PRODUCT_NAME: 'Project Danger',
  PRODUCT_ID: 'project-danger',
  PRODUCT_LOGO: '/images/logo.svg',
  PRODUCT_API_URL: 'http://localhost:3001/api',
  // Documentation
  DOCUMENTATION_URL: 'https://docs.project-danger.com/',
  // Support
  SUPPORT_EMAIL: 'support@project-danger.com',
  SUPPORT_LINK: 'https://support.project-danger.com/',
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
  PATH_DOCUMENT_NEW: '/document/new',
  PATH_DOCUMENT_NEW_PARAM: 'new',
  MAX_COOKIE_AGE_MS: '604800000', // 7 days
  NOTIFICATION_TYPES: NOTIFICATION_TYPES,
  NOTIFICATION_RESOURCE: NOTIFICATION_RESOURCE,
  // Fields
  FIELD_LABELS: {
    [FIELD_TYPES.STRING]: 'text-field-',
    [FIELD_TYPES.TEXT]: 'text-area-',
    [FIELD_TYPES.NUMBER]: 'number-'
  },
  FIELD_TYPES: FIELD_TYPES,
  // Roles
  PROJECT_ROLE_IDS: PROJECT_ROLE_IDS,
  PROJECT_ROLE_NAMES: PROJECT_ROLE_NAMES,
  ORGANIZATION_ROLE_IDS: ORGANIZATION_ROLE_IDS,
  PROJECT_ACCESS_LEVELS: PROJECT_ACCESS_LEVELS
}
