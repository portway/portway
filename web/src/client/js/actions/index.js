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
  // Project Assignments
  REQUEST_PROJECT_ASSIGNEES: 'REQUEST_PROJECT_ASSIGNEES',
  RECEIVE_PROJECT_ASSIGNEES: 'RECEIVE_PROJECT_ASSIGNEES',
  CREATE_PROJECT_ASSIGNEE: 'CREATE_PROJECT_ASSIGNEE',
  RECEIVE_CREATED_PROJECT_ASSIGNEE: 'RECEIVE_CREATED_PROJECT_ASSIGNEE',
  INITIATE_PROJECT_ASSIGNEE_UPDATE: 'INITIATE_PROJECT_ASSIGNEE_UPDATE',
  RECEIVE_UPDATED_PROJECT_ASSIGNEE: 'RECEIVE_UPDATED_PROJECT_ASSIGNEE',
  INITIATE_PROJECT_ASSIGNEE_REMOVE: 'INITIATE_PROJECT_ASSIGNEE_REMOVE',
  REMOVE_PROJECT_ASSIGNEE: 'REMOVE_PROJECT_ASSIGNEE',
  // Project Keys
  REQUEST_PROJECT_TOKENS: 'REQUEST_PROJECT_TOKENS',
  RECEIVE_PROJECT_TOKENS: 'RECEIVE_PROJECT_TOKENS',
  // Documents
  REQUEST_DOCUMENTS: 'REQUEST_DOCUMENTS',
  RECEIVE_DOCUMENTS: 'RECEIVE_DOCUMENTS',
  INITIATE_DOCUMENT_CREATE: 'INITIATE_DOCUMENT_CREATE',
  RECEIVE_CREATED_DOCUMENT: 'RECEIVE_CREATED_DOCUMENT',
  INITIATE_DOCUMENT_UPDATE: 'INITIATE_UPDATE_DOCUMENT',
  RECEIVE_UPDATED_DOCUMENT: 'RECEIVE_UPDATED_DOCUMENT',
  INITIATE_DOCUMENT_REMOVE: 'INITIATE_DOCUMENT_REMOVE',
  REMOVE_DOCUMENT: 'REMOVE_DOCUMENT',
  REQUEST_DOCUMENT: 'REQUEST_DOCUMENT',
  RECEIVE_DOCUMENT: 'RECEIVE_DOCUMENT',
  // Fields
  REQUEST_FIELDS: 'REQUEST_FIELDS',
  RECEIVE_FIELDS: 'RECEIVE_FIELDS',
  INITIATE_FIELD_CREATE: 'INITIATE_FIELD_CREATE',
  RECEIVE_CREATED_FIELD: 'RECEIVE_CREATED_FIELD',
  INITIATE_FIELD_UPDATE: 'INITIATE_FIELD_UPDATE',
  RECEIVE_UPDATED_FIELD: 'RECEIVE_UPDATED_FIELD',
  INITIATE_FIELD_ORDER: 'INITIATE_FIELD_ORDER',
  INITIATE_FIELD_REMOVE: 'INITIATE_FIELD_REMOVE',
  REMOVE_FIELD: 'REMOVE_FIELD',
  // Users
  REQUEST_USERS: 'REQUEST_USERS',
  RECEIVE_USERS: 'RECEIVE_USERS',
  REQUEST_USER: 'REQUEST_USER',
  RECEIVE_USER: 'RECEIVE_USER',
  LOGOUT_USER: 'LOGOUT_USER',
  // User Project Assignments
  REQUEST_USER_PROJECT_ASSIGNMENTS: 'REQUEST_USER_PROJECT_ASSIGNMENTS',
  RECEIVE_USER_PROJECT_ASSIGNMENTS: 'RECEIVE_USER_PROJECT_ASSIGNMENTS',
  // UI
  UI_DOCUMENT_CREATE: 'UI_DOCUMENT_CREATE',
  UI_INITIATE_CONFIRMATION: 'UI_INITIATE_CONFIRMATION',
  UI_CANCEL_CONFIRMATION: 'UI_CANCEL_CONFIRMATION',
  UI_COMPLETE_CONFIRMATION: 'UI_COMPLETE_CONFIRMATION'
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

export const ProjectAssignees = {
  request: makeActionCreator(ActionTypes.REQUEST_PROJECT_ASSIGNEES, 'projectId'),
  receive: makeActionCreator(ActionTypes.RECEIVE_PROJECT_ASSIGNEES, 'projectId', 'data'),
  create: makeActionCreator(ActionTypes.CREATE_PROJECT_ASSIGNEE, 'projectId'),
  receiveOneCreated: makeActionCreator(ActionTypes.RECEIVE_CREATED_PROJECT_ASSIGNEE, 'projectId', 'data'),
  initiateUpdate: makeActionCreator(ActionTypes.INITIATE_PROJECT_ASSIGNEE_UPDATE, 'projectId'),
  receiveOneUpdated: makeActionCreator(ActionTypes.RECEIVE_UPDATED_PROJECT_ASSIGNEE, 'data'),
  initiateRemove: makeActionCreator(ActionTypes.INITIATE_PROJECT_ASSIGNEE_REMOVE, 'projectId', 'assignmentId'),
  removedOne: makeActionCreator(ActionTypes.REMOVE_PROJECT_ASSIGNEE, 'projectId', 'userId'),
}

export const ProjectTokens = {
  request: makeActionCreator(ActionTypes.REQUEST_PROJECT_TOKENS, 'projectId'),
  receive: makeActionCreator(ActionTypes.RECEIVE_PROJECT_TOKENS, 'projectId', 'data'),
}

export const Documents = {
  create: makeActionCreator(ActionTypes.INITIATE_DOCUMENT_CREATE, 'projectId', 'data'),
  receiveOneCreated: makeActionCreator(ActionTypes.RECEIVE_CREATED_DOCUMENT, 'data'),
  update: makeActionCreator(ActionTypes.INITIATE_DOCUMENT_UPDATE, 'projectId', 'documentId', 'data'),
  receiveOneUpdated: makeActionCreator(ActionTypes.RECEIVE_UPDATED_DOCUMENT, 'data'),
  delete: makeActionCreator(ActionTypes.INITIATE_DOCUMENT_REMOVE, 'projectId', 'documentId'),
  deleted: makeActionCreator(ActionTypes.REMOVE_DOCUMENT, 'projectId', 'documentId'),
  requestOne: makeActionCreator(ActionTypes.REQUEST_DOCUMENT, 'projectId', 'documentId'),
  receiveOne: makeActionCreator(ActionTypes.RECEIVE_DOCUMENT, 'data'),
  requestList: makeActionCreator(ActionTypes.REQUEST_DOCUMENTS, 'projectId'),
  receiveList: makeActionCreator(ActionTypes.RECEIVE_DOCUMENTS, 'projectId', 'data')
}

export const Fields = {
  requestList: makeActionCreator(ActionTypes.REQUEST_FIELDS, 'documentId'),
  receiveList: makeActionCreator(ActionTypes.RECEIVE_FIELDS, 'documentId', 'data'),
  initiateCreate: makeActionCreator(ActionTypes.INITIATE_FIELD_CREATE, 'documentId', 'fieldType'),
  receiveOneCreated: makeActionCreator(ActionTypes.RECEIVE_CREATED_FIELD, 'data'),
  initiateOrderUpdate: makeActionCreator(ActionTypes.INITIATE_FIELD_ORDER, 'documentId', 'fieldId', 'newOrder'),
  initiateUpdate: makeActionCreator(ActionTypes.INITIATE_FIELD_UPDATE, 'fieldId'),
  receiveOneUpdated: makeActionCreator(ActionTypes.RECEIVE_UPDATED_FIELD, 'data'),
  initiateRemove: makeActionCreator(ActionTypes.INITIATE_FIELD_REMOVE),
  removeOne: makeActionCreator(ActionTypes.REMOVE_FIELD, 'documentId', 'fieldId')
}

export const Users = {
  request: makeActionCreator(ActionTypes.REQUEST_USERS),
  receive: makeActionCreator(ActionTypes.RECEIVE_USERS, 'data'),
  requestOne: makeActionCreator(ActionTypes.REQUEST_USER, 'id'),
  receiveOne: makeActionCreator(ActionTypes.RECEIVE_USER, 'data'),
  logout: makeActionCreator(ActionTypes.LOGOUT_USER, 'id')
}

export const UserProjectAssignments = {
  request: makeActionCreator(ActionTypes.REQUEST_USER_PROJECT_ASSIGNMENTS),
  receive: makeActionCreator(ActionTypes.RECEIVE_USER_PROJECT_ASSIGNMENTS, 'userId', 'data')
}

export const UI = {
  initiateConfirm: makeActionCreator(ActionTypes.UI_INITIATE_CONFIRMATION, 'message', 'cancelAction', 'confirmedAction', 'confirmedLabel'),
  cancelConfirm: makeActionCreator(ActionTypes.UI_CANCEL_CONFIRMATION),
  completeConfirm: makeActionCreator(ActionTypes.UI_COMPLETE_CONFIRMATION),
  documentCreate: makeActionCreator(ActionTypes.UI_DOCUMENT_CREATE, 'value')
}
