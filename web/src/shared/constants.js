const FIELD_TYPES = {
  STRING: 1,
  TEXT: 2,
  NUMBER: 3,
  IMAGE: 4,
  DATE: 5,
  FILE: 6
}

// Fields that only a single user can edit at once
const SYNC_SINGLE_USER_EDIT_FIELDS = [
  FIELD_TYPES.DATE, FIELD_TYPES.IMAGE, FIELD_TYPES.FILE
]

const PLAN_TYPES = {
  MULTI_USER: 'MULTI_USER',
  SINGLE_USER: 'SINGLE_USER',
  MULTI_USER_FREE: 'MULTI_USER_FREE',
  SINGLE_USER_FREE: 'SINGLE_USER_FREE',
  PER_USER: 'PER_USER'
}

// Numbers are in gigabytes
const PLAN_LIMITS = {
  [PLAN_TYPES.SINGLE_USER]: {
    storage: 10
  },
  [PLAN_TYPES.SINGLE_USER_FREE]: {
    storage: 10
  },
  [PLAN_TYPES.MULTI_USER]: {
    storage: 10
  },
  [PLAN_TYPES.MULTI_USER_FREE]: {
    storage: 10
  },
  [PLAN_TYPES.PERUSER]: {
    storage: 10
  }
}

const FREE_PLAN_TYPES = [
  PLAN_TYPES.SINGLE_USER_FREE,
  PLAN_TYPES.MULTI_USER_FREE
]

const MULTI_USER_PLAN_TYPES = [
  PLAN_TYPES.MULTI_USER,
  PLAN_TYPES.MULTI_USER_FREE,
  PLAN_TYPES.PER_USER
]

const PLAN_TITLES = {
  [PLAN_TYPES.SINGLE_USER]: 'Solo plan',
  [PLAN_TYPES.MULTI_USER]: 'Team plan',
  [PLAN_TYPES.MULTI_USER_FREE]: 'Team plan for friends',
  [PLAN_TYPES.SINGLE_USER_FREE]: 'Solo plan for friends'
}

const PRICING = {
  [PLAN_TYPES.SINGLE_USER]: '$10/mo',
  [PLAN_TYPES.MULTI_USER]: '$50/mo',
  [PLAN_TYPES.MULTI_USER_FREE]: '$0/mo',
  [PLAN_TYPES.SINGLE_USER_FREE]: '$0/mo'
}

const ORG_SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  CANCELED: 'CANCELED',
  INACTIVE: 'INACTIVE', //NO PARALLEL STRIPE API STATUS
  INCOMPLETE: 'INCOMPLETE',
  INCOMPLETE_EXPIRED: 'INCOMPLETE_EXPIRED',
  PAST_DUE: 'PAST_DUE',
  PENDING_CANCEL: 'PENDING_CANCEL', //NO PARALLEL STRIPE API STATUS
  TRIAL_ENDED: 'TRIAL_ENDED',
  TRIALING: 'TRIALING',
  TRIALING_PENDING_ACTIVE: 'TRIALING_PENDING_ACTIVE', //NO PARALLEL STRIPE API STATUS
  UNPAID: 'UNPAID'
}

// We will lock out users in the UI if the subscriptionStatus is any of the following
const LOCKED_ACCOUNT_STATUSES = [
  ORG_SUBSCRIPTION_STATUS.CANCELED,
  ORG_SUBSCRIPTION_STATUS.INACTIVE,
  ORG_SUBSCRIPTION_STATUS.INCOMPLETE_EXPIRED,
  ORG_SUBSCRIPTION_STATUS.INCOMPLETE,
  ORG_SUBSCRIPTION_STATUS.PAST_DUE,
  ORG_SUBSCRIPTION_STATUS.TRIAL_ENDED,
  ORG_SUBSCRIPTION_STATUS.UNPAID
]

const TRIALING_STATUSES = [
  ORG_SUBSCRIPTION_STATUS.TRIALING,
  null
]

// This should only be used by marketing side, not in the app
// as that always comes from stripe
const PLAN_PRICING = {
  [PLAN_TYPES.SINGLE_USER]: 10,
  [PLAN_TYPES.MULTI_USER]: 50,
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

const READ_ONLY_ROLE_IDS = [PROJECT_ROLE_IDS.READER]

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
  DOCUMENT: 'DOCUMENT',
  DOCUMENTS: 'DOCUMENTS',
  FIELD: 'FIELD',
  ORGANIZATION: 'ORGANIZATION',
  PROJECT_ASSIGNMENT: 'PROJECT ASSIGNMENT',
  PROJECT: 'PROJECT',
  PROJECTS: 'PROJECTS',
  USER: 'USER',
}

const ORGANIZATION_SETTINGS = {
  ALLOW_USER_PROJECT_CREATION: 'allowUserProjectCreation'
}

const QUERY_PARAMS = {
  ASCENDING: 'ASC',
  DESCENDING: 'DESC'
}

const DOCUMENT_MODE = {
  NORMAL: 'NORMAL',
  EDIT: 'EDIT',
}

const STATUS_TYPES = {
  DUPLICATING_DOCUMENT: 'DUPLICATING_DOCUMENT'
}

const NETWORK_STATUS = {
  OFFLINE: 'offline',
  ONLINE: 'online',
}

// Note: This is so we can use this webpack as well, don't convert this to ES6
module.exports = {
  PRODUCT_NAME: 'Portway',
  PRODUCT_ID: 'portway',
  PRODUCT_LOGO: '/images/logo.svg',
  // Application
  NETWORK_STATUS: NETWORK_STATUS,
  // Documentation
  URL_API_DOCS: 'https://docs.portway.app/api',
  URL_DOCUMENTATION: 'https://docs.portway.app/',
  URL_GUIDES: 'https://docs.portway.app/guides',
  URL_PRIVACY: 'https://getportway.com/privacy',
  URL_TERMS: 'https://getportway.com/terms',
  URL_TWITTER: 'https://twitter.com/portwayapp',
  URL_WEBSITE: 'https://getportway.com/',
  // Fields
  FIELD_LABELS: {
    [FIELD_TYPES.STRING]: 'text-field-',
    [FIELD_TYPES.TEXT]: 'text-area-',
    [FIELD_TYPES.NUMBER]: 'number-',
    [FIELD_TYPES.IMAGE]: 'image-',
    [FIELD_TYPES.DATE]: 'date-',
    [FIELD_TYPES.FILE]: 'file-'
  },
  FIELD_TYPES: FIELD_TYPES,
  SYNC_SINGLE_USER_EDIT_FIELDS: SYNC_SINGLE_USER_EDIT_FIELDS,
  // Default text strings
  LABEL_NEW_DOCUMENT: 'New document',
  MAX_COOKIE_AGE_MS: 1.21e+9, // 14 days
  MAX_FIELD_NAME_SIZE: 50,
  MIN_PASSWORD_LENGTH: 8,
  // Page titles
  TITLE_PROJECTS: 'Projects',
  // Notifications
  NOTIFICATION_TYPES: NOTIFICATION_TYPES,
  NOTIFICATION_RESOURCE: NOTIFICATION_RESOURCE,
  // Paths
  PATH_ADMIN: '/admin',
  PATH_APP: '/d',
  PATH_BILLING: '/admin/billing',
  PATH_PAYMENT: '/admin/billing/payment',
  PATH_DOCUMENT_NEW_PARAM: 'new',
  PATH_DOCUMENT_NEW: '/document/new',
  PATH_DOCUMENT: '/document',
  PATH_HELP: '/help',
  PATH_LOGOUT: '/logout',
  PATH_ORGANIZATION: '/admin/organization',
  PATH_PROJECT_CREATE: '/project/create',
  PATH_PROJECT: '/project',
  PATH_PROJECTS: '/projects',
  PATH_SETTINGS: '/settings',
  PATH_USERS: '/admin/users',
  // Roles
  ORGANIZATION_ROLE_IDS: ORGANIZATION_ROLE_IDS,
  ORGANIZATION_ROLE_NAMES: ORGANIZATION_ROLE_NAMES,
  ORGANIZATION_SETTINGS: ORGANIZATION_SETTINGS,
  PROJECT_ACCESS_LEVELS: PROJECT_ACCESS_LEVELS,
  PROJECT_ROLE_IDS: PROJECT_ROLE_IDS,
  PROJECT_ROLE_NAMES: PROJECT_ROLE_NAMES,
  READ_ONLY_ROLE_IDS: READ_ONLY_ROLE_IDS,
  // Plans
  LOCKED_ACCOUNT_STATUSES,
  ORG_SUBSCRIPTION_STATUS: ORG_SUBSCRIPTION_STATUS,
  PLAN_PRICING: PLAN_PRICING,
  PLAN_TYPES: PLAN_TYPES,
  PLAN_TITLES: PLAN_TITLES,
  PLAN_LIMITS: PLAN_LIMITS,
  FREE_PLAN_TYPES: FREE_PLAN_TYPES,
  MULTI_USER_PLAN_TYPES: MULTI_USER_PLAN_TYPES,
  PRICING: PRICING,
  TRIALING_STATUSES,
  // TODO: remove when we are pulling from stripe data again
  ADDITIONAL_SEAT_COST: 1000,
  // Query params
  QUERY_PARAMS: QUERY_PARAMS,
  // Support
  SUPPORT_EMAIL: 'support@portway.app',
  FEEDBACK_EMAIL: 'feedback@bonkeybong.com',
  SUPPORT_LINK: 'https://getportway.com/support',
  // UI Related
  DOCUMENT_MODE: DOCUMENT_MODE,
  STATUS_TYPES: STATUS_TYPES,
  MOBILE_MATCH_SIZE: '(max-width: 768px)',
  // Files max values
  MAX_FILE_SIZE_BYTES: 10e7,
  MAX_AVATAR_SIZE: 1024 * 1000,
  IMAGE_ALLOWED_TYPES: [
    'image/apng',
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/webp',
    'image/x-icon'
  ],
  FILES_DISALLOWED_EXTENSIONS: [
    'exe',
  ],
}
