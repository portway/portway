import { makeActionCreator } from '../utilities/redux'

export const ActionTypes = {
  // Projects
  REQUEST_PROJECTS: 'REQUEST_PROJECTS',
  RECEIVE_PROJECTS: 'RECEIVE_PROJECTS',
  REQUEST_PROJECT: 'REQUEST_PROJECT',
  RECEIVE_PROJECT: 'RECEIVE_PROJECT',
  CREATE_PROJECT: 'CREATE_PROJECT',
  RECEIVE_CREATED_PROJECT: 'RECEIVE_CREATED_PROJECT',
  INITIATE_PROJECT_UPDATE: 'INITIATE_PROJECT_UPDATE',
  RECEIVE_UPDATED_PROJECT: 'RECEIVE_UPDATED_PROJECT',
  INITIATE_PROJECT_REMOVE: 'INITIATE_PROJECT_REMOVE',
  REMOVE_PROJECT: 'REMOVE_PROJECT',
  // Documents
  REQUEST_PROJECT_DOCUMENTS: 'REQUEST_PROJECT_DOCUMENTS',
  RECEIVE_PROJECT_DOCUMENTS: 'RECEIVE_PROJECT_DOCUMENTS',
  CREATE_DOCUMENT: 'CREATE_DOCUMENT',
  RECEIVE_CREATED_DOCUMENT: 'RECEIVE_CREATED_DOCUMENT',
  REQUEST_DOCUMENT: 'REQUEST_DOCUMENT',
  RECEIVE_DOCUMENT: 'RECEIVE_DOCUMENT',
  // Users
  REQUEST_USERS: 'REQUEST_USERS',
  RECEIVE_USERS: 'RECEIVE_USERS',
  REQUEST_USER: 'REQUEST_USER',
  RECEIVE_USER: 'RECEIVE_USER',
  LOGOUT_USER: 'LOGOUT_USER'
}

export const Projects = {
  request: makeActionCreator(ActionTypes.REQUEST_PROJECTS),
  receive: makeActionCreator(ActionTypes.RECEIVE_PROJECTS, 'data'),
  requestOne: makeActionCreator(ActionTypes.REQUEST_PROJECT, 'id'),
  receiveOne: makeActionCreator(ActionTypes.RECEIVE_PROJECT, 'data'),
  create: makeActionCreator(ActionTypes.CREATE_PROJECT),
  receiveOneCreated: makeActionCreator(ActionTypes.RECEIVE_CREATED_PROJECT, 'data'),
  initiateUpdate: makeActionCreator(ActionTypes.INITIATE_PROJECT_UPDATE),
  receiveOneUpdated: makeActionCreator(ActionTypes.RECEIVE_UPDATED_PROJECT, 'data'),
  initiateRemove: makeActionCreator(ActionTypes.INITIATE_PROJECT_REMOVE),
  removeOne: makeActionCreator(ActionTypes.REMOVE_PROJECT, 'id')
}

export const ProjectDocuments = {
  request: makeActionCreator(ActionTypes.REQUEST_PROJECT_DOCUMENTS, 'projectId'),
  receive: makeActionCreator(ActionTypes.RECEIVE_PROJECT_DOCUMENTS, 'projectId', 'data'),
  create: makeActionCreator(ActionTypes.CREATE_DOCUMENT, 'projectId'),
  receiveOneCreated: makeActionCreator(ActionTypes.RECEIVE_CREATED_DOCUMENT, 'data'),
  requestOne: makeActionCreator(ActionTypes.REQUEST_DOCUMENT, 'projectId', 'documentId'),
  receiveOne: makeActionCreator(ActionTypes.RECEIVE_DOCUMENT, 'data'),
}

export const Users = {
  request: makeActionCreator(ActionTypes.REQUEST_USERS),
  receive: makeActionCreator(ActionTypes.RECEIVE_USERS, 'data'),
  requestOne: makeActionCreator(ActionTypes.REQUEST_USER, 'id'),
  receiveOne: makeActionCreator(ActionTypes.RECEIVE_USER, 'data'),
  logout: makeActionCreator(ActionTypes.LOGOUT_USER, 'id')
}
