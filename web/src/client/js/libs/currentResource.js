// Get the current resource based on the url
// Takes react-router's match obj as arg
//
// useDataService compatible function
import dataMapper from './dataMapper'

const urlToResource = [
  {
    regex: new RegExp('.*project/.*'),
    func: dataMapper.project.id,
    idName: 'projectId'
  },
  // Catch-all for empty current resource
  // Must be last in array!
  {
    regex: new RegExp('.*'),
    func: () => {
      return {
        fetchAction: () => {},
        getLoadingStatusFromState: () => {},
        getDataFromState: () => {}
      }
    },
    idName: null
  }
]

const currentResource = (match) => {
  const path = match.path

  const resource = urlToResource.find((resource) => {
    return resource.regex.test(path)
  })

  return resource.func(match.params[resource.idName])
}

export default currentResource
