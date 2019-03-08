import { makeActionCreator } from '../utilities/redux'

export const ActionTypes = {
  // Projects
  REQUEST_PROJECTS: 'REQUEST_PROJECTS',
  RECEIVE_PROJECTS: 'RECEIVE_PROJECTS',
  REQUEST_PROJECT: 'REQUEST_PROJECT',
  RECEIVE_PROJECT: 'RECEIVE_PROJECT'
}

export const Projects = {
  request: makeActionCreator(ActionTypes.REQUEST_PROJECTS)
}

export const Project = {
  request: makeActionCreator(ActionTypes.REQUEST_PROJECT, 'id')
}
