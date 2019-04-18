
import resourceTypes from './resourceTypes'
import globalPublicFields from './globalPublicFields'

const DOCUMENT_PUBLIC_FIELDS = ['name', 'publishedVersionId', 'projectId'].concat(globalPublicFields)

const PROJECT_PUBLIC_FIELDS = ['name', 'description'].concat(globalPublicFields)

const FIELD_PUBLIC_FIELDS = [
  'name',
  'value',
  'structuredValue',
  'docId',
  'versionId',
  'type',
  'order'
].concat(globalPublicFields)

const PROJECT_USERS_PUBLIC_FIELDS = ['id', 'roleId', 'projectId', 'userId'].concat(globalPublicFields)

const USER_PUBLIC_FIELDS = ['firstName', 'lastName', 'email', 'orgRoleId'].concat(globalPublicFields)


export default {
  [resourceTypes.DOCUMENT]: Object.freeze(DOCUMENT_PUBLIC_FIELDS),
  [resourceTypes.PROJECT]: Object.freeze(PROJECT_PUBLIC_FIELDS),
  [resourceTypes.FIELD]: Object.freeze(FIELD_PUBLIC_FIELDS),
  [resourceTypes.PROJECT_USER]: Object.freeze(PROJECT_USERS_PUBLIC_FIELDS),
  [resourceTypes.USER]: Object.freeze(USER_PUBLIC_FIELDS)
}