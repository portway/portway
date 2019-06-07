const FIELD_TYPES = {
  STRING: 1,
  TEXT: 2,
  NUMBER: 3
}

const ORGANIZATION_ROLE_IDS = {
  OWNER: 1,
  ADMIN: 2,
  USER: 3
}

const ORGANIZATION_ROLE_NAMES = {
  [ORGANIZATION_ROLE_IDS.OWNER]: 'Owner',
  [ORGANIZATION_ROLE_IDS.ADMIN]: 'Admin',
  [ORGANIZATION_ROLE_IDS.USER]: 'User'
}

const PROJECT_ROLE_IDS = {
  ADMIN: 1,
  CONTRIBUTOR: 2,
  READER: 3
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
  DOCUMENT: 'DOCUMENT',
  FIELD: 'FIELD',
  ORGANIZATION: 'ORGANIZATION'
}

const ORGANIZATION_SETTINGS = {
  ALLOW_USER_PROJECT_CREATION: 'allowUserProjectCreation'
}

const QUERY_PARAMS = {
  ASCENDING: 'ASC',
  DESCENDING: 'DESC'
}

// Note: This is so we can use this webpack as well, don't convert this to ES6
module.exports = {
  PRODUCT_NAME: 'Project Danger',
  PRODUCT_ID: 'project-danger',
  PRODUCT_LOGO: '/images/logo.svg',
  PRODUCT_API_URL: 'http://localhost:3001/api',
  // Documentation
  DOCUMENTATION_URL: 'https://docs.project-danger.com/',
  // Fields
  FIELD_LABELS: {
    [FIELD_TYPES.STRING]: 'text-field-',
    [FIELD_TYPES.TEXT]: 'text-area-',
    [FIELD_TYPES.NUMBER]: 'number-'
  },
  FIELD_TYPES: FIELD_TYPES,
  // Default text strings
  LABEL_NEW_DOCUMENT: 'New Document',
  MAX_COOKIE_AGE_MS: '604800000', // 7 days
  // Notifications
  NOTIFICATION_TYPES: NOTIFICATION_TYPES,
  NOTIFICATION_RESOURCE: NOTIFICATION_RESOURCE,
  // Paths
  PATH_APP: '/d',
  PATH_BILLING: '/settings/billing',
  PATH_ADMIN: '/admin',
  PATH_DOCUMENT: '/document',
  PATH_DOCUMENT_NEW: '/document/new',
  PATH_DOCUMENT_NEW_PARAM: 'new',
  PATH_LOGOUT: '/logout',
  PATH_PROJECT: '/project',
  PATH_PROJECTS: '/projects',
  PATH_PROJECT_CREATE: '/project/create',
  PATH_SETTINGS: '/settings',
  PATH_DOCUMENT_NEW: '/document/new',
  PATH_DOCUMENT_NEW_PARAM: 'new',
  // Roles
  ORGANIZATION_ROLE_IDS: ORGANIZATION_ROLE_IDS,
  ORGANIZATION_ROLE_NAMES: ORGANIZATION_ROLE_NAMES,
  ORGANIZATION_SETTINGS: ORGANIZATION_SETTINGS,
  PROJECT_ACCESS_LEVELS: PROJECT_ACCESS_LEVELS,
  PROJECT_ROLE_IDS: PROJECT_ROLE_IDS,
  PROJECT_ROLE_NAMES: PROJECT_ROLE_NAMES,
  // Query params
  QUERY_PARAMS: QUERY_PARAMS,
  // Support
  SUPPORT_EMAIL: 'support@project-danger.com',
  SUPPORT_LINK: 'https://support.project-danger.com/',
}
