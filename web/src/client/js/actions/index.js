import { makeActionCreator } from '../utilities/redux'

export const ActionTypes = {
  // Projects
  REQUEST_PROJECTS: 'REQUEST_PROJECTS',
  RECEIVE_PROJECTS: 'RECEIVE_PROJECTS',
  REQUEST_PROJECT: 'REQUEST_PROJECT',
  RECEIVE_PROJECT: 'RECEIVE_PROJECT',
  ADD_PROJECT: 'POST_PROJECT',
  RECEIVE_CREATED_PROJECT: 'PROJECT_CREATED',
  // Users
  REQUEST_USERS: 'REQUEST_USERS',
  RECEIVE_USERS: 'RECEIVE_USERS',
  REQUEST_USER: 'REQUEST_USER',
  RECEIVE_USER: 'RECEIVE_USER'
}

export const Projects = {
  request: makeActionCreator(ActionTypes.REQUEST_PROJECTS),
  receive: makeActionCreator(ActionTypes.RECEIVE_PROJECTS, 'data'),
  requestOne: makeActionCreator(ActionTypes.REQUEST_PROJECT, 'id'),
  receiveOne: makeActionCreator(ActionTypes.RECEIVE_PROJECT, 'data'),
  addOne: makeActionCreator(ActionTypes.ADD_PROJECT, 'body'),
  receiveOneCreated: makeActionCreator(ActionTypes.RECEIVE_CREATED_PROJECT, 'data')
}

export const Users = {
  request: makeActionCreator(ActionTypes.REQUEST_USERS),
  receive: makeActionCreator(ActionTypes.RECEIVE_USERS, 'data'),
  requestOne: makeActionCreator(ActionTypes.REQUEST_USER, 'id'),
  receiveOne: makeActionCreator(ActionTypes.RECEIVE_USER, 'data')
}
