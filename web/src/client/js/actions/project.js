import { ActionTypes, Project } from './index'

/**
 * Fetch projects for the user
 * @returns Promise with data
 */
const getProjectsForUser = () => {
  return true
}

/**
 * Redux action
 * @returns Redux dispatch with data
 */
export const listProjects = () => {
  return (dispatch) => {
    dispatch(Project.list())
    return getProjectsForUser().then((data) => {
      dispatch({
        type: ActionTypes.LIST_PROJECTS,
        data
      })
    })
  }
}
