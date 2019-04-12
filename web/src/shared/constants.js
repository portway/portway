// Note: This is so we can use this webpack as well, don't convert this to ES6
module.exports = {
  PRODUCT_NAME: 'Project Danger',
  PRODUCT_ID: 'project-danger',
  PRODUCT_LOGO: '/images/logo.svg',
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
  FIELD_TYPES: {
    STRING: 1,
    TEXT: 2,
    NUMBER: 3
  }
}
