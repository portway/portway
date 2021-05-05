import { PROJECT_ACCESS_LEVELS, PROJECT_ROLE_IDS, READ_ONLY_ROLE_IDS } from 'Shared/constants'

/**
 * @param {boolean} assignmentLoading user project assignments loading state
 * undefined = hasn't started loading; true = currently loading; false = finished loading
 * @param {object} userProjectAssignment user project assignment object for this specific project
 * @param {'read', 'write', undefined} projectAccessLevel org wide user access level for project
 * @returns boolean
 */
export default function isDocumentReadOnly(assignmentLoading, userProjectAssignment, projectAccessLevel) {
  // default to false so we don't limit any functionality temporarily for someone who needs it
  let documentReadOnlyMode = false
  // false means the user project assignments are finished loading
  if (assignmentLoading === false) {
    // User has the project reader role and project is not set to "write"
    if (userProjectAssignment &&
      READ_ONLY_ROLE_IDS.includes(userProjectAssignment.roleId) &&
      projectAccessLevel !== PROJECT_ACCESS_LEVELS.WRITE
    ) {
      documentReadOnlyMode = true
      // User has no assignment for this project, and the project is set to "read"
    } else if (userProjectAssignment === undefined && projectAccessLevel === PROJECT_ACCESS_LEVELS.READ) {
      documentReadOnlyMode = true
    }
  }

  return documentReadOnlyMode
}
