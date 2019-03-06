import { ActionTypes, Project } from './index'
import { fetch } from '../api'

/**
 * Redux action
 * @returns Redux dispatch with data
 */
export const fetchProjects = () => {
  return (dispatch) => {
    dispatch(Project.list())
    return fetch('projects').then((data) => {
      dispatch({
        type: ActionTypes.RECEIVE_PROJECTS,
        data
      })
    })
  }
}
