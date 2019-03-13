import { ActionTypes, Projects, Project } from './index'
import { fetch } from '../api'

/**
 * Redux action
 * @returns Redux dispatch with data
 */
export const fetchProjects = (dispatch) => {
  dispatch(Projects.request())
  return fetch('projects').then((data) => {
    dispatch({
      type: ActionTypes.RECEIVE_PROJECTS,
      data
    })
  })
}

export const fetchProject = (id) => {
  return (dispatch) => {
    dispatch(Project.request(id))
    return fetch(`projects/${id}`).then((data) => {
      dispatch({
        type: ActionTypes.RECEIVE_PROJECT,
        data
      })
    })
  }
}
