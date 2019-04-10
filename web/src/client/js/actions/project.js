import { Projects } from './index'
import { fetch, add, update, remove } from '../api'
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
    dispatch(Projects.requestOne(id))
    const data = await fetch(`projects/${id}`)
    dispatch(Projects.receiveOne(data))
  }
}

export const createProject = (body, history) => {
  return async (dispatch) => {
    dispatch(Projects.create())
    const data = await add('projects', body)
    dispatch(Projects.receiveOneCreated(data))
    history.push({ pathname: `${Constants.PATH_PROJECT}/${data.id}` })
  }
}

export const updateProject = (id, body) => {
  return async (dispatch) => {
    dispatch(Projects.initiateUpdate())
    const data = await update(`projects/${id}`, body)
    dispatch(Projects.receiveOneUpdated(data))
  }
}

export const removeProject = (id, history) => {
  return async (dispatch) => {
    dispatch(Projects.initiateRemove())
    await remove(`projects/${id}`)
    dispatch(Projects.removeOne(id))
    history.push({ pathname: Constants.PATH_PROJECTS })
  }
}
