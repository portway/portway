import { makeActionCreator } from '../utilities/redux'

export const ActionTypes = {
  // Projects
  LIST_PROJECTS: 'LIST_PROJECTS',
  RECEIVE_PROJECTS: 'RECEIVE_PROJECTS',
  CREATE_PROJECT: 'CREATE_PROJECT',
  EDIT_PROJECT: 'EDIT_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  // Documents
  LIST_DOCUMENTS: 'LIST_DOCUMENTS',
  CREATE_DOCUMENT: 'CREATE_DOCUMENT',
  EDIT_DOCUMENT: 'EDIT_DOCUMENT',
  DELETE_DOCUMENT: 'DELETE_DOCUMENT'
}

export const Project = {
  list: makeActionCreator(ActionTypes.LIST_PROJECTS),
  create: makeActionCreator(ActionTypes.CREATE_PROJECT),
  edit: makeActionCreator(ActionTypes.EDIT_PROJECT, 'id'),
  delete: makeActionCreator(ActionTypes.DELETE_PROJECT, 'id')
}

export const Document = {
  list: makeActionCreator(ActionTypes.LIST_DOCUMENTS),
  create: makeActionCreator(ActionTypes.CREATE_DOCUMENT),
  edit: makeActionCreator(ActionTypes.EDIT_DOCUMENT, 'id'),
  delete: makeActionCreator(ActionTypes.DELETE_DOCUMENT, 'id')
}
