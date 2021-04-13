
import resourceTypes from './resourceTypes'
import globalPublicFields from './globalPublicFields'

const PROJECT_DOCUMENT_PUBLIC_FIELDS = [
  'name',
  'publishedVersionId',
  'projectId',
  'lastPublishedAt',
  'slug'
].concat(globalPublicFields)

const DOCUMENT_PUBLIC_FIELDS = PROJECT_DOCUMENT_PUBLIC_FIELDS.concat(['fields'])

const PROJECT_PUBLIC_FIELDS = [
  'name',
  'description',
  'accessLevel',
  'createdBy'
].concat(globalPublicFields)

const FIELD_PUBLIC_FIELDS = [
  'name',
  'value',
  'structuredValue',
  'documentId',
  'versionId',
  'type',
  'order',
  'meta',
  'renderedValue',
  'formats',
  'alignment',
  'alt'
].concat(globalPublicFields)

const PROJECT_USERS_PUBLIC_FIELDS = ['id', 'roleId', 'projectId', 'userId'].concat(globalPublicFields)

const USER_PUBLIC_FIELDS = ['name', 'email', 'orgRoleId', 'pending', 'avatar'].concat(globalPublicFields)

const PROJECT_TOKEN_PUBLIC_FIELDS = ['token', 'name', 'projectId', 'roleId'].concat(globalPublicFields)

const ORGANIZATION_PUBLIC_FIELDS = [
  'name',
  'ownerId',
  'allowUserProjectCreation',
  'avatar',
  'plan',
  'subscriptionStatus',
  'canceledAt'
].concat(globalPublicFields)

const WEBHOOK_PUBLIC_FIELDS = ['projectId', 'url', 'active'].concat(globalPublicFields)

const WEBHOOK_DELIVERY_PUBLIC_FIELDS = ['webhookId', 'resultCode'].concat(globalPublicFields)

export default {
  [resourceTypes.PROJECT_DOCUMENT]: Object.freeze(PROJECT_DOCUMENT_PUBLIC_FIELDS),
  [resourceTypes.DOCUMENT]: Object.freeze(DOCUMENT_PUBLIC_FIELDS),
  [resourceTypes.PROJECT]: Object.freeze(PROJECT_PUBLIC_FIELDS),
  [resourceTypes.FIELD]: Object.freeze(FIELD_PUBLIC_FIELDS),
  [resourceTypes.PROJECT_USER]: Object.freeze(PROJECT_USERS_PUBLIC_FIELDS),
  [resourceTypes.USER]: Object.freeze(USER_PUBLIC_FIELDS),
  [resourceTypes.PROJECT_TOKEN]: Object.freeze(PROJECT_TOKEN_PUBLIC_FIELDS),
  [resourceTypes.ORGANIZATION]: Object.freeze(ORGANIZATION_PUBLIC_FIELDS),
  [resourceTypes.WEBHOOK]: Object.freeze(WEBHOOK_PUBLIC_FIELDS),
  [resourceTypes.WEBHOOK_DELIVERY]: Object.freeze(WEBHOOK_DELIVERY_PUBLIC_FIELDS)
}