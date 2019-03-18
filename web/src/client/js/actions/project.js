import { Projects } from './index'
import { fetch, post } from '../api'
import Constants from 'Shared/constants'

/**
 * Redux action
 * @returns Redux dispatch with data
 */
export const fetchProjects = async (dispatch) => {
  dispatch(Projects.request())
  const data = await fetch('projects')
  dispatch(Projects.receive(data))
}

export const fetchProject = (id) => {
  return async (dispatch) => {
    dispatch(Projects.request(id))
    const data = await fetch(`projects/${id}`)
    dispatch(Projects.receiveOne(data))
  }
}

export const createProject = (body, history) => {
  return async (dispatch) => {
    dispatch(Projects.addOne(body))
    const data = await post(`projects`, body)
    dispatch(Projects.receiveOneCreated(data))
    history.push({ pathname: `${Constants.PATH_PROJECT}/${data.id}` })
  }
}
