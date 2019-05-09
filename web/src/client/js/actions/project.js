import { Projects, ProjectAssignees, ProjectTokens, Notifications } from './index'
import { fetch, add, update, remove, globalErrorCodes } from '../api'
import { PATH_PROJECT, PATH_PROJECTS, NOTIFICATION_RESOURCE, NOTIFICATION_TYPES } from 'Shared/constants'

/**
 * Redux action
 * @returns Redux dispatch with data
 */
export const fetchProjects = async (dispatch) => {
  dispatch(Projects.request())
  const { data, status } = await fetch('projects')
  globalErrorCodes.includes(status) ?
    dispatch(Notifications.create(data, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECTS, status)) :
    dispatch(Projects.receive(data))
}

export const fetchProject = (projectId) => {
  return async (dispatch) => {
    dispatch(Projects.requestOne(projectId))
    const { data, status } = await fetch(`projects/${projectId}`)
    globalErrorCodes.includes(status) ?
      dispatch(Notifications.create(data, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECT, status)) :
      dispatch(Projects.receiveOne(data))
  }
}

export const createProject = (body, history) => {
  return async (dispatch) => {
    dispatch(Projects.create())
    const { data } = await add('projects', body)
    dispatch(Projects.receiveOneCreated(data))
    history.push({ pathname: `${PATH_PROJECT}/${data.id}` })
  }
}

export const updateProject = (projectId, body) => {
  return async (dispatch) => {
    dispatch(Projects.initiateUpdate())
    const { data } = await update(`projects/${projectId}`, body)
    dispatch(Projects.receiveOneUpdated(data))
  }
}

export const removeProject = (projectId, history) => {
  return async (dispatch) => {
    dispatch(Projects.initiateRemove())
    await remove(`projects/${projectId}`)
    dispatch(Projects.removeOne(projectId))
    history.push({ pathname: PATH_PROJECTS })
  }
}

/**
 * Project assignments
 */
export const fetchProjectAssignees = (projectId) => {
  return async (dispatch) => {
    dispatch(ProjectAssignees.request(projectId))
    const { data } = await fetch(`projects/${projectId}/assignments`)
    dispatch(ProjectAssignees.receive(projectId, data))
  }
}

export const createProjectAssignee = (projectId, body) => {
  return async (dispatch) => {
    dispatch(ProjectAssignees.create(projectId))
    const { data } = await add(`projects/${projectId}/assignments`, body)
    dispatch(ProjectAssignees.receiveOneCreated(projectId, data))
  }
}

export const updateProjectAssignee = (projectId, assignmentId, body) => {
  return async (dispatch) => {
    dispatch(ProjectAssignees.initiateUpdate(projectId))
    const { data } = await update(`projects/${projectId}/assignments/${assignmentId}`, body)
    dispatch(ProjectAssignees.receiveOneUpdated(data))
  }
}

export const removeProjectAssignee = (projectId, userId, assignmentId) => {
  return async (dispatch) => {
    dispatch(ProjectAssignees.initiateRemove(projectId))
    await remove(`projects/${projectId}/assignments/${assignmentId}`)
    dispatch(ProjectAssignees.removedOne(projectId, userId))
  }
}

/**
 * Project Keys
 */
export const fetchProjectTokens = (projectId) => {
  return async (dispatch) => {
    // ... get the keys
    dispatch(ProjectTokens.request(projectId))
    const { data } = await fetch(`projects/${projectId}/tokens`)
    dispatch(ProjectTokens.receive(projectId, data))
  }
}

export const createProjectToken = (projectId, body) => {
  return async (dispatch) => {
    dispatch(ProjectTokens.create(projectId))
    const { data } = await add(`projects/${projectId}/tokens`, body)
    dispatch(ProjectTokens.receiveOneCreated(data))
  }
}

export const removeProjectToken = (projectId, tokenId) => {
  return async (dispatch) => {
    dispatch(ProjectTokens.initiateRemove(projectId, tokenId))
    await remove(`projects/${projectId}/tokens/${tokenId}`)
    dispatch(ProjectTokens.removedOne(projectId, tokenId))
  }
}
