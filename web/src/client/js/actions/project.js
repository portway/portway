import { currentUserId } from 'Libs/currentIds'
import { Validation, Projects, ProjectAssignees, ProjectTokens, Notifications } from './index'
import { formSubmitAction, formSucceededAction, formFailedAction } from './form'
import { fetch, add, update, remove, globalErrorCodes, validationCodes } from '../api'
import { PATH_PROJECT, PATH_PROJECTS, NOTIFICATION_RESOURCE, NOTIFICATION_TYPES } from 'Shared/constants'

/**
 * Redux action
 * @returns Redux dispatch with data
 */
export const fetchProjects = async (dispatch) => {
  dispatch(Projects.request())
  const { data, status } = await fetch(`v1/users/${currentUserId}/projects`)
  globalErrorCodes.includes(status) ?
    dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECTS, status)) :
    dispatch(Projects.receive(data))
}

export const fetchProjectsForUser = (userId) => {
  return async (dispatch) => {
    dispatch(Projects.requestForUser(userId))
    const { data, status } = await fetch(`v1/users/${userId}/projects`)
    globalErrorCodes.includes(status) ?
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECTS, status)) :
      dispatch(Projects.receiveForUser(userId, data))
  }
}

export const fetchProject = (projectId) => {
  return async (dispatch) => {
    dispatch(Projects.requestOne(projectId))
    const { data, status } = await fetch(`v1/projects/${projectId}`)

    if (globalErrorCodes.includes(status)) {
      dispatch(Projects.receiveError(projectId))
      status !== 404 && dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECT, status))
      return
    }

    dispatch(Projects.receiveOne(data))
  }
}

export const createProject = (body, history) => {
  return async (dispatch) => {
    dispatch(Projects.create())
    const { data, status } = await add('v1/projects', body)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECT, status))
      return
    }
    if (validationCodes.includes(status)) {
      dispatch(Validation.create('project', data, status))
      return
    }
    dispatch(Projects.receiveOneCreated(data))
    history.push({ pathname: `${PATH_PROJECT}/${data.id}` })
  }
}

export const updateProject = (formId, projectId, body) => {
  return async (dispatch) => {
    dispatch(formSubmitAction(formId))
    dispatch(Projects.initiateUpdate())
    const { data, status } = await update(`v1/projects/${projectId}`, body)
    if (globalErrorCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECT, status))
      return
    }
    if (validationCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Validation.create('project', data, status))
    } else {
      dispatch(formSucceededAction(formId))
      dispatch(Projects.receiveOneUpdated(data))
    }
  }
}

export const removeProject = (projectId, history) => {
  return async (dispatch) => {
    dispatch(Projects.initiateRemove())
    const { data, status } = await remove(`v1/projects/${projectId}`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECT, status))
      return
    }
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
    const { data, status } = await fetch(`v1/projects/${projectId}/assignments?includeUser=true`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECT_ASSIGNMENT, status))
      return
    }
    dispatch(ProjectAssignees.receive(projectId, data))
  }
}

export const createProjectAssignee = (projectId, body) => {
  return async (dispatch) => {
    dispatch(ProjectAssignees.create(projectId))
    const { data, status } = await add(`v1/projects/${projectId}/assignments?includeUser=true`, body)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECT_ASSIGNMENT, status))
      return
    }
    validationCodes.includes(status) ?
      dispatch(Validation.create('project', data, status)) :
      dispatch(ProjectAssignees.receiveOneCreated(projectId, data))
  }
}

export const updateProjectAssignee = (projectId, assignmentId, body) => {
  return async (dispatch) => {
    dispatch(ProjectAssignees.initiateUpdate(projectId))
    const { data, status } = await update(`v1/projects/${projectId}/assignments/${assignmentId}`, body)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECT_ASSIGNMENT, status))
      return
    }
    validationCodes.includes(status) ?
      dispatch(Validation.create('project', data, status)) :
      dispatch(ProjectAssignees.receiveOneUpdated(data))
  }
}

export const removeProjectAssignee = (projectId, userId, assignmentId) => {
  return async (dispatch) => {
    dispatch(ProjectAssignees.initiateRemove(projectId, userId))
    const { data, status } = await remove(`v1/projects/${projectId}/assignments/${assignmentId}`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECT_ASSIGNMENT, status))
      return
    }
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
    const { data, status } = await fetch(`v1/projects/${projectId}/tokens`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    dispatch(ProjectTokens.receive(projectId, data))
  }
}

export const createProjectToken = (projectId, body) => {
  return async (dispatch) => {
    dispatch(ProjectTokens.create(projectId))
    const { data, status } = await add(`v1/projects/${projectId}/tokens`, body)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    validationCodes.includes(status) ?
      dispatch(Validation.create('project', data, status)) :
      dispatch(ProjectTokens.receiveOneCreated(data))
  }
}

export const removeProjectToken = (projectId, tokenId) => {
  return async (dispatch) => {
    dispatch(ProjectTokens.initiateRemove(projectId, tokenId))
    const { data, status } = await remove(`v1/projects/${projectId}/tokens/${tokenId}`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.PROJECT, status))
      return
    }
    dispatch(ProjectTokens.removedOne(projectId, tokenId))
  }
}
