import BusinessDocument from '../../businesstime/document'
import ACTIONS from '../../constants/actions'

const documentAccess = async (requestorInfo, requestedAction) => {
  switch (requestedAction.action) {
    case ACTIONS.READ:
    case ACTIONS.UPDATE:
    case ACTIONS.DELETE:
    case ACTIONS.LIST:
    case ACTIONS.CREATE:
      // find the parent project for the provided document id and check perms off of that
      // TODO: since this logic is mostly repetition from the projects permission file,
      // we should break the check out into it's own reusable thing
      const project = await BusinessDocument.findParentProjectByDocumentId(
        requestedAction.data.id,
        requestorInfo.orgId
      )
      console.log(project)

      const hasProjectAccess = project && project.orgId === requestorInfo.orgId
      return Boolean(hasProjectAccess)
    default:
      return false
  }
}

export default documentAccess
