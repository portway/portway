
import resourceTypes from './resourceTypes'
import globalPublicFields from './globalPublicFields'

const DOCUMENT_PUBLIC_FIELDS = ['name', 'publishedVersionId', 'projectId'].concat(globalPublicFields)

export default {
  [resourceTypes.DOCUMENT]: DOCUMENT_PUBLIC_FIELDS
}