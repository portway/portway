
import resourceTypes from './resourceTypes'
import globalPublicFields from './globalPublicFields'

const DOCUMENT_PUBLIC_FIELDS = ['name', 'publishedVersionId', 'projectId'].concat(globalPublicFields)

const PROJECT_PUBLIC_FIELDS = ['name', 'description'].concat(globalPublicFields)

export default {
  [resourceTypes.DOCUMENT]: DOCUMENT_PUBLIC_FIELDS,
  [resourceTypes.PROJECT]: PROJECT_PUBLIC_FIELDS
}