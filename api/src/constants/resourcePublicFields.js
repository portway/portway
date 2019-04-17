
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

export default {
  [resourceTypes.DOCUMENT]: DOCUMENT_PUBLIC_FIELDS,
  [resourceTypes.PROJECT]: PROJECT_PUBLIC_FIELDS,
  [resourceTypes.FIELD]: FIELD_PUBLIC_FIELDS
}