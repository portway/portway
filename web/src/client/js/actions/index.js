import { makeActionCreator } from '../utilities/redux'

export const ActionTypes = {
  // Projects
  REQUEST_PROJECTS: 'REQUEST_PROJECTS',
  RECEIVE_PROJECTS: 'RECEIVE_PROJECTS',
  REQUEST_PROJECT: 'REQUEST_PROJECT',
  RECEIVE_PROJECT: 'RECEIVE_PROJECT',
  REQUEST_USERS: 'REQUEST_USERS',
  RECEIVE_USERS: 'RECEIVE_USERS',
  REQUEST_USER: 'REQUEST_USER',
  RECEIVE_USER: 'RECEIVE_USER'
}

export const Projects = {
  request: makeActionCreator(ActionTypes.REQUEST_PROJECTS)
}

export const Project = {
  request: makeActionCreator(ActionTypes.REQUEST_PROJECT, 'id')
}

export const Users = {
  request: makeActionCreator(ActionTypes.REQUEST_USERS),
  receive: makeActionCreator(ActionTypes.RECEIVE_USERS, 'data'),
  requestOne: makeActionCreator(ActionTypes.REQUEST_USER, 'id'),
  receiveOne: makeActionCreator(ActionTypes.RECEIVE_USER, 'data')
}
