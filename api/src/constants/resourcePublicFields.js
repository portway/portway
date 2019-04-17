
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
  [resourceTypes.DOCUMENT]: DOCUMENT_PUBLIC_FIELDS,
  [resourceTypes.PROJECT]: PROJECT_PUBLIC_FIELDS,
  [resourceTypes.FIELD]: FIELD_PUBLIC_FIELDS,
  [resourceTypes.PROJECT_USER]: PROJECT_USERS_PUBLIC_FIELDS,
  [resourceTypes.PROJECT_USER]: USER_PUBLIC_FIELDS
}