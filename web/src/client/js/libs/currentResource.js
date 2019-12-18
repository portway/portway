// Get the current resource based on the url
// Takes react-router's location path as arg, and produces params using matchPath
// This is so components _outside_ of a Route still work
//
// useDataService compatible function
import { matchPath } from 'react-router-dom'
import dataMapper from './dataMapper'

function returnNull() {
  return {
    fetchAction: () => null,
    getLoadingStatusFromState: () => null,
    getDataFromState: () => null
  }
}

/**
 * @param resourceName {String} resource name for switch statement
 * @param path {String} React Router location.pathname
 * Marks a resource for fetch or return of cached redux state
 * Returns an object of functions to be consumed by useDataService React Hook
 */
const currentResource = (resourceName, path) => {
  let func
  let matchResults
  let returnValue
  switch (resourceName) {
    case 'project':
      // Specifically look at project here, as we may be looking at documents
      const projectPathArray = path.split('/')
      const projectPath = `/${projectPathArray[1]}/${projectPathArray[2]}`
      if (projectPathArray[2] === 'create') {
        returnValue = returnNull()
        break
      }

      matchResults = matchPath(projectPath, {
        path: '/project/:projectId',
        exact: true,
        strict: false
      })

      if (matchResults && isNaN(matchResults.params.projectId)) {
        returnValue = returnNull()
        break
      }

      func = dataMapper.projects.id
      if (matchResults) {
        returnValue = matchResults.params.projectId ?
          func(matchResults.params.projectId) : returnNull()
      } else {
        returnValue = returnNull()
      }
      break
    case 'document':
      matchResults = matchPath(path, {
        path: '/project/:projectId/document/:documentId',
        exact: true,
        strict: false
      })
      if (matchResults && matchResults.params.documentId === 'new') {
        returnValue = returnNull()
        break
      }
      // if either project or document ids in the url aren't numbers, don't fetch
      if (matchResults && (isNaN(matchResults.params.documentId) || isNaN(matchResults.params.projectId))) {
        returnValue = returnNull()
        break
      }
      func = dataMapper.documents.id
      if (matchResults && matchResults.params.documentId) {
        returnValue = func(matchResults.params.projectId, matchResults.params.documentId)
      } else {
        returnValue = returnNull()
      }
      break
    default:
      // Return empty functions
      returnNull()
      break
  }
  return returnValue
}

export default currentResource
