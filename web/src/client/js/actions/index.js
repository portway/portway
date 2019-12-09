import { makeActionCreator } from '../utilities/redux'

export const ActionTypes = {
  // Projects
  REQUEST_PROJECTS: 'REQUEST_PROJECTS',
  RECEIVE_PROJECTS: 'RECEIVE_PROJECTS',
  REQUEST_PROJECT: 'REQUEST_PROJECT',
  RECEIVE_PROJECT: 'RECEIVE_PROJECT',
  RECEIVE_PROJECT_ERROR: 'RECEIVE_PROJECT_ERROR',
  CREATE_PROJECT: 'CREATE_PROJECT',
  RECEIVE_CREATED_PROJECT: 'RECEIVE_CREATED_PROJECT',
  INITIATE_PROJECT_UPDATE: 'INITIATE_PROJECT_UPDATE',
  RECEIVE_UPDATED_PROJECT: 'RECEIVE_UPDATED_PROJECT',
  INITIATE_PROJECT_REMOVE: 'INITIATE_PROJECT_REMOVE',
  REMOVE_PROJECT: 'REMOVE_PROJECT',
  REQUEST_USER_PROJECTS: 'REQUEST_USER_PROJECTS',
  RECEIVE_USER_PROJECTS: 'RECEIVE_USER_PROJECTS',
  // Project Assignments
  REQUEST_PROJECT_ASSIGNEES: 'REQUEST_PROJECT_ASSIGNEES',
  RECEIVE_PROJECT_ASSIGNEES: 'RECEIVE_PROJECT_ASSIGNEES',
  CREATE_PROJECT_ASSIGNEE: 'CREATE_PROJECT_ASSIGNEE',
  RECEIVE_CREATED_PROJECT_ASSIGNEE: 'RECEIVE_CREATED_PROJECT_ASSIGNEE',
  INITIATE_PROJECT_ASSIGNEE_UPDATE: 'INITIATE_PROJECT_ASSIGNEE_UPDATE',
  RECEIVE_UPDATED_PROJECT_ASSIGNEE: 'RECEIVE_UPDATED_PROJECT_ASSIGNEE',
  INITIATE_PROJECT_ASSIGNEE_REMOVE: 'INITIATE_PROJECT_ASSIGNEE_REMOVE',
  REMOVE_PROJECT_ASSIGNEE: 'REMOVE_PROJECT_ASSIGNEE',
  // Project Tokens
  REQUEST_PROJECT_TOKENS: 'REQUEST_PROJECT_TOKENS',
  RECEIVE_PROJECT_TOKENS: 'RECEIVE_PROJECT_TOKENS',
  CREATE_PROJECT_TOKEN: 'CREATE_PROJECT_TOKEN',
  RECEIVE_CREATED_PROJECT_TOKEN: 'RECEIVE_CREATED_PROJECT_TOKEN',
  INITIATE_PROJECT_TOKEN_REMOVE: 'INITIATE_PROJECT_TOKEN_REMOVE',
  REMOVE_PROJECT_TOKEN: 'REMOVE_PROJECT_TOKEN',
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
  INITIATE_DOCUMENT_PUBLISH: 'INITIATE_DOCUMENT_PUBLISH',
  RECEIVE_PUBLISHED_DOCUMENT: 'RECEIVE_PUBLISHED_DOCUMENT',
  INITIATE_DOCUMENT_UNPUBLISH: 'INITIATE_DOCUMENT_UNPUBLISH',
  RECEIVE_UNPUBLISHED_DOCUMENT: 'RECEIVE_UNPUBLISHED_DOCUMENT',
  RECEIVE_DOCUMENT_RESULTS: 'RECEIVE_DOCUMENT_RESULTS',
  INITIATE_DOCUMENT_SEARCH: 'INITIATE_DOCUMENT_SEARCH',
  // Fields
  INITIATE_FIELD_CREATE: 'INITIATE_FIELD_CREATE',
  RECEIVE_CREATED_FIELD: 'RECEIVE_CREATED_FIELD',
  INITIATE_FIELD_UPDATE: 'INITIATE_FIELD_UPDATE',
  RECEIVE_UPDATED_FIELD: 'RECEIVE_UPDATED_FIELD',
  INITIATE_FIELD_ORDER: 'INITIATE_FIELD_ORDER',
  INITIATE_FIELD_REMOVE: 'INITIATE_FIELD_REMOVE',
  INITIATE_FIELD_MOVE: 'INITIATE_FIELD_MOVE',
  INITIATE_FIELD_COPY: 'INITIATE_FIELD_COPY',
  FIELD_COPIED: 'FIELD_COPIED',
  FIELD_MOVED: 'FIELD_MOVED',
  REMOVE_FIELD: 'REMOVE_FIELD',
  FOCUS_FIELD: 'FOCUS_FIELD',
  BLUR_FIELD: 'BLUR_FIELD',
  // Notifications
  CREATE_NOTIFICATION: 'CREATE_NOTIFICATION',
  DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
  // Forms
  FORM_SUBMITTED: 'FORM_SUBMITTED',
  FORM_SUCCEEDED: 'FORM_SUCCEEDED',
  FORM_FAILED: 'FORM_FAILED',
  FORM_RESET: 'FORM_RESET',
  // Validation
  CREATE_VALIDATION_ERRORS: 'CREATE_VALIDATION_ERRORS',
  CLEAR_VALIDATION_ERRORS: 'CLEAR_VALIDATION_ERRORS',
  // Routes
  ROUTE_CHANGE: 'ROUTE_CHANGE',
  // Users
  REQUEST_USERS: 'REQUEST_USERS',
  RECEIVE_USERS: 'RECEIVE_USERS',
  REQUEST_USER: 'REQUEST_USER',
  RECEIVE_USER: 'RECEIVE_USER',
  INITIATE_USER_UPDATE: 'INITIATE_USER_UPDATE',
  RECEIVE_UPDATED_USER: 'RECEIVE_UPDATED_USER',
  RECEIVE_UPDATED_USER_ROLE: 'RECEIVE_UPDATED_USER_ROLE',
  RECEIVE_UPDATED_USER_AVATAR: 'RECEIVE_UPDATED_USER_AVATAR',
  RECEIVE_UPDATED_USER_PASSWORD: 'RECEIVE_UPDATED_USER_PASSWORD',
  INITIATE_USER_CREATE: 'INITIATE_USER_CREATE',
  RECEIVE_CREATED_USER: 'RECEIVE_CREATED_USER',
  INITIATE_USER_REMOVE: 'INITIATE_USER_REMOVE',
  INITIATE_USER_REINVITE: 'INITIATE_USER_REINVITE',
  RECEIVE_REINVITED_USER: 'RECEIVE_REINVITED_USER',
  REMOVE_USER: 'REMOVE_USER',
  LOGOUT_USER: 'LOGOUT_USER',
  INITIATE_USER_SEARCH_BY_NAME: 'INITIATE_USER_SEARCH_BY_NAME',
  RECEIVE_USER_SEARCH_RESULTS_BY_NAME: 'RECEIVE_USER_SEARCH_RESULTS_BY_NAME',
  SORT_USERS: 'SORT_USERS',
  // User Project Assignments
  REQUEST_USER_PROJECT_ASSIGNMENTS: 'REQUEST_USER_PROJECT_ASSIGNMENTS',
  RECEIVE_USER_PROJECT_ASSIGNMENTS: 'RECEIVE_USER_PROJECT_ASSIGNMENTS',
  // Organizations
  REQUEST_ORGANIZATION: 'REQUEST_ORGANIZATION',
  RECEIVE_ORGANIZATION: 'RECEIVE_ORGANIZATION',
  INITIATE_ORGANIZATION_UPDATE: 'INITIATE_ORGANIZATION_UPDATE',
  RECEIVE_UPDATED_ORGANIZATION: 'RECEIVE_UPDATED_ORGANIZATION',
  RECEIVE_UPDATED_ORGANIZATION_AVATAR: 'RECEIVE_UPDATED_ORGANIZATION_AVATAR',
  REQUEST_ORGANIZATION_BILLING: 'REQUEST_ORGANIZATION_BILLING',
  RECEIVE_ORGANIZATION_BILLING: 'RECEIVE_ORGANIZATION_BILLING',
  INITIATE_ORGANIZATION_BILLING_UPDATE: 'INITIATE_ORGANIZATION_BILLING_UPDATE',
  RECEIVE_UPDATED_ORGANIZATION_BILLING: 'RECEIVE_UPDATED_ORGANIZATION_BILLING',
  RECEIVE_BILLING_ERROR: 'RECEIVE_BILLING_ERROR',
  INITIATE_ORGANIZATION_PLAN_UPDATE: 'INITIATE_ORGANIZATION_PLAN_UPDATE',
  RECEIVE_UPDATED_ORGANIZATION_PLAN: 'RECEIVE_UPDATED_ORGANIZATION_PLAN',
  INITIATE_ORGANIZATION_SEATS_UPDATE: 'INITIATE_ORGANIZATION_SEATS_UPDATE',
  RECEIVE_UPDATED_ORGANIZATION_SEATS: 'RECEIVE_UPDATED_ORGANIZATION_SEATS',
  RECEIVE_SEATS_ERROR: 'RECEIVE_SEATS_ERROR',
  INITIATE_ORGANIZATION_REMOVAL: 'INITIATE_ORGANIZATION_REMOVAL',
  RECEIVE_REMOVED_ORGANIZATION: 'RECEIVE_REMOVED_ORGANIZATION',
  // UI
  UI_CANCEL_CONFIRMATION: 'UI_CANCEL_CONFIRMATION',
  UI_COMPLETE_CONFIRMATION: 'UI_COMPLETE_CONFIRMATION',
  UI_CREATE_TOKEN_MODE: 'UI_CREATE_TOKEN_MODE',
  UI_CREATE_USER_MODE: 'UI_CREATE_USER_MODE',
  UI_DOCUMENT_CREATE: 'UI_DOCUMENT_CREATE',
  UI_DOCUMENT_FULL_SCREEN: 'UI_DOCUMENT_FULL_SCREEN',
  UI_DOCUMENT_MODE: 'UI_DOCUMENT_MODE',
  UI_INITIATE_CONFIRMATION: 'UI_INITIATE_CONFIRMATION',
  UI_TOGGLE_STRIPE_FORM: 'UI_TOGGLE_STRIPE_FORM',
  // Search
  SEARCH_CLEAR: 'SEARCH_CLEAR',
}

export const Route = {
  change: makeActionCreator(ActionTypes.ROUTE_CHANGE)
}

export const Validation = {
  create: makeActionCreator(ActionTypes.CREATE_VALIDATION_ERRORS, 'resource', 'data', 'status'),
  clear: makeActionCreator(ActionTypes.CLEAR_VALIDATION_ERRORS, 'resource')
}

export const Form = {
  submitted: makeActionCreator(ActionTypes.FORM_SUBMITTED, 'name'),
  succeeded: makeActionCreator(ActionTypes.FORM_SUCCEEDED, 'name'),
  failed: makeActionCreator(ActionTypes.FORM_FAILED, 'name'),
  reset: makeActionCreator(ActionTypes.FORM_RESET, 'name'),
}

export const Projects = {
  request: makeActionCreator(ActionTypes.REQUEST_PROJECTS),
  receive: makeActionCreator(ActionTypes.RECEIVE_PROJECTS, 'data'),
  requestOne: makeActionCreator(ActionTypes.REQUEST_PROJECT, 'id'),
  receiveOne: makeActionCreator(ActionTypes.RECEIVE_PROJECT, 'data'),
  receiveError: makeActionCreator(ActionTypes.RECEIVE_PROJECT_ERROR, 'projectId'),
  create: makeActionCreator(ActionTypes.CREATE_PROJECT),
  receiveOneCreated: makeActionCreator(ActionTypes.RECEIVE_CREATED_PROJECT, 'data'),
  initiateUpdate: makeActionCreator(ActionTypes.INITIATE_PROJECT_UPDATE),
  receiveOneUpdated: makeActionCreator(ActionTypes.RECEIVE_UPDATED_PROJECT, 'data'),
  initiateRemove: makeActionCreator(ActionTypes.INITIATE_PROJECT_REMOVE),
  removeOne: makeActionCreator(ActionTypes.REMOVE_PROJECT, 'id'),
  requestForUser: makeActionCreator(ActionTypes.REQUEST_USER_PROJECTS, 'userId'),
  receiveForUser: makeActionCreator(ActionTypes.RECEIVE_USER_PROJECTS, 'userId', 'data')
}

export const ProjectAssignees = {
  request: makeActionCreator(ActionTypes.REQUEST_PROJECT_ASSIGNEES, 'projectId'),
  receive: makeActionCreator(ActionTypes.RECEIVE_PROJECT_ASSIGNEES, 'projectId', 'data'),
  create: makeActionCreator(ActionTypes.CREATE_PROJECT_ASSIGNEE, 'projectId'),
  receiveOneCreated: makeActionCreator(ActionTypes.RECEIVE_CREATED_PROJECT_ASSIGNEE, 'projectId', 'data'),
  initiateUpdate: makeActionCreator(ActionTypes.INITIATE_PROJECT_ASSIGNEE_UPDATE, 'projectId'),
  receiveOneUpdated: makeActionCreator(ActionTypes.RECEIVE_UPDATED_PROJECT_ASSIGNEE, 'data'),
  initiateRemove: makeActionCreator(ActionTypes.INITIATE_PROJECT_ASSIGNEE_REMOVE, 'projectId', 'userId'),
  removedOne: makeActionCreator(ActionTypes.REMOVE_PROJECT_ASSIGNEE, 'projectId', 'userId'),
}

export const ProjectTokens = {
  request: makeActionCreator(ActionTypes.REQUEST_PROJECT_TOKENS, 'projectId'),
  receive: makeActionCreator(ActionTypes.RECEIVE_PROJECT_TOKENS, 'projectId', 'data'),
  create: makeActionCreator(ActionTypes.CREATE_PROJECT_TOKEN, 'projectId'),
  receiveOneCreated: makeActionCreator(ActionTypes.RECEIVE_CREATED_PROJECT_TOKEN, 'data'),
  initiateRemove: makeActionCreator(ActionTypes.INITIATE_PROJECT_TOKEN_REMOVE, 'projectId', 'tokenId'),
  removedOne: makeActionCreator(ActionTypes.REMOVE_PROJECT_TOKEN, 'projectId', 'tokenId'),
}

export const Documents = {
  create: makeActionCreator(ActionTypes.INITIATE_DOCUMENT_CREATE, 'projectId', 'data'),
  delete: makeActionCreator(ActionTypes.INITIATE_DOCUMENT_REMOVE, 'projectId', 'documentId'),
  deleted: makeActionCreator(ActionTypes.REMOVE_DOCUMENT, 'projectId', 'documentId'),
  publish: makeActionCreator(ActionTypes.INITIATE_DOCUMENT_PUBLISH, 'documentId'),
  receiveList: makeActionCreator(ActionTypes.RECEIVE_DOCUMENTS, 'projectId', 'data'),
  receiveOne: makeActionCreator(ActionTypes.RECEIVE_DOCUMENT, 'data'),
  receiveOneCreated: makeActionCreator(ActionTypes.RECEIVE_CREATED_DOCUMENT, 'data'),
  receiveOneUpdated: makeActionCreator(ActionTypes.RECEIVE_UPDATED_DOCUMENT, 'data'),
  receivePublishedVersion: makeActionCreator(ActionTypes.RECEIVE_PUBLISHED_DOCUMENT, 'data'),
  requestList: makeActionCreator(ActionTypes.REQUEST_DOCUMENTS, 'projectId'),
  requestOne: makeActionCreator(ActionTypes.REQUEST_DOCUMENT, 'documentId'),
  update: makeActionCreator(ActionTypes.INITIATE_DOCUMENT_UPDATE, 'projectId', 'documentId', 'data'),
  unpublish: makeActionCreator(ActionTypes.INITIATE_DOCUMENT_UNPUBLISH, 'documentId'),
  receiveUnpublishedVersion: makeActionCreator(ActionTypes.RECEIVE_UNPUBLISHED_DOCUMENT, 'data'),
  initiateSearch: makeActionCreator(ActionTypes.INITIATE_DOCUMENT_SEARCH, 'value'),
  receiveSearchResults: makeActionCreator(ActionTypes.RECEIVE_DOCUMENT_RESULTS, 'data'),
}

export const Fields = {
  initiateCreate: makeActionCreator(ActionTypes.INITIATE_FIELD_CREATE, 'documentId', 'fieldType'),
  receiveOneCreated: makeActionCreator(ActionTypes.RECEIVE_CREATED_FIELD, 'projectId', 'documentId', 'data'),
  initiateOrderUpdate: makeActionCreator(ActionTypes.INITIATE_FIELD_ORDER, 'documentId', 'fieldId', 'newOrder'),
  initiateUpdate: makeActionCreator(ActionTypes.INITIATE_FIELD_UPDATE, 'fieldId'),
  receiveOneUpdated: makeActionCreator(ActionTypes.RECEIVE_UPDATED_FIELD, 'projectId', 'documentId', 'data'),
  // Move & Copy
  initiateMove: makeActionCreator(ActionTypes.INITIATE_FIELD_MOVE, 'projectId', 'oldDocumentId', 'newDocumentId', 'fieldId'),
  movedField: makeActionCreator(ActionTypes.FIELD_MOVED, 'projectId', 'oldDocumentId', 'newDocumentId', 'fieldId'),
  initiateCopy: makeActionCreator(ActionTypes.INITIATE_FIELD_COPY, 'projectId', 'oldDocumentId', 'newDocumentId', 'fieldId'),
  copiedField: makeActionCreator(ActionTypes.FIELD_COPIED, 'projectId', 'oldDocumentId', 'newDocumentId', 'fieldId'),
  // Remove
  initiateRemove: makeActionCreator(ActionTypes.INITIATE_FIELD_REMOVE),
  removeOne: makeActionCreator(ActionTypes.REMOVE_FIELD, 'projectId', 'documentId', 'fieldId'),
  // Blur / Focus
  blurField: makeActionCreator(ActionTypes.BLUR_FIELD, 'fieldId', 'fieldType', 'fieldData'),
  focusField: makeActionCreator(ActionTypes.FOCUS_FIELD, 'fieldId', 'fieldType', 'fieldData'),
}

export const Notifications = {
  create: makeActionCreator(ActionTypes.CREATE_NOTIFICATION, 'message', 'noticeType', 'resource', 'code'),
  dismiss: makeActionCreator(ActionTypes.DISMISS_NOTIFICATION, 'noticeId'),
}

export const Users = {
  request: makeActionCreator(ActionTypes.REQUEST_USERS, 'page'),
  receive: makeActionCreator(ActionTypes.RECEIVE_USERS, 'data', 'page', 'totalPages'),
  requestOne: makeActionCreator(ActionTypes.REQUEST_USER, 'userId'),
  receiveOne: makeActionCreator(ActionTypes.RECEIVE_USER, 'data'),
  create: makeActionCreator(ActionTypes.INITIATE_USER_CREATE, 'userId'),
  receiveOneCreated: makeActionCreator(ActionTypes.RECEIVE_CREATED_USER, 'data'),
  initiateUpdate: makeActionCreator(ActionTypes.INITIATE_USER_UPDATE, 'userId'),
  receiveOneUpdated: makeActionCreator(ActionTypes.RECEIVE_UPDATED_USER, 'data'),
  receiveUpdatedAvatar: makeActionCreator(ActionTypes.RECEIVE_UPDATED_USER_AVATAR, 'userId', 'data'),
  receiveUpdatedPassword: makeActionCreator(ActionTypes.RECEIVE_UPDATED_USER_PASSWORD, 'userId', 'data'),
  receiveUpdatedRole: makeActionCreator(ActionTypes.RECEIVE_UPDATED_USER_ROLE, 'userId', 'orgRoleId'),
  initiateRemove: makeActionCreator(ActionTypes.INITIATE_USER_REMOVE, 'userId'),
  removeOne: makeActionCreator(ActionTypes.REMOVE_USER, 'userId'),
  initiateReinvite: makeActionCreator(ActionTypes.INITIATE_USER_REINVITE, 'userId'),
  receiveSuccessfulReinvite: makeActionCreator(ActionTypes.RECEIVE_REINVITED_USER, 'userId'),
  logout: makeActionCreator(ActionTypes.LOGOUT_USER, 'id'),
  initiateSearchByName: makeActionCreator(ActionTypes.INITIATE_USER_SEARCH_BY_NAME, 'partialNameString'),
  receiveSearchResultsByName: makeActionCreator(ActionTypes.RECEIVE_USER_SEARCH_RESULTS_BY_NAME, 'data', 'partialNameString'),
  sort: makeActionCreator(ActionTypes.SORT_USERS, 'sortBy', 'sortMethod')
}

export const UserProjectAssignments = {
  request: makeActionCreator(ActionTypes.REQUEST_USER_PROJECT_ASSIGNMENTS, 'userId'),
  receive: makeActionCreator(ActionTypes.RECEIVE_USER_PROJECT_ASSIGNMENTS, 'userId', 'data')
}

export const Organizations = {
  requestOne: makeActionCreator(ActionTypes.REQUEST_ORGANIZATION, 'id'),
  receiveOne: makeActionCreator(ActionTypes.RECEIVE_ORGANIZATION, 'data'),
  initiateUpdate: makeActionCreator(ActionTypes.INITIATE_ORGANIZATION_UPDATE, 'id'),
  receiveOneUpdated: makeActionCreator(ActionTypes.RECEIVE_UPDATED_ORGANIZATION, 'data'),
  receiveUpdatedAvatar: makeActionCreator(ActionTypes.RECEIVE_UPDATED_ORGANIZATION_AVATAR, 'id', 'data'),
  requestBilling: makeActionCreator(ActionTypes.REQUEST_ORGANIZATION_BILLING, 'id'),
  receiveBilling: makeActionCreator(ActionTypes.RECEIVE_ORGANIZATION_BILLING, 'id', 'data'),
  initiateBillingUpdate: makeActionCreator(ActionTypes.INITIATE_ORGANIZATION_BILLING_UPDATE, 'id'),
  receiveUpdatedBilling: makeActionCreator(ActionTypes.RECEIVE_UPDATED_ORGANIZATION_BILLING, 'id', 'data'),
  receiveBillingError: makeActionCreator(ActionTypes.RECEIVE_BILLING_ERROR),
  initiatePlanUpdate: makeActionCreator(ActionTypes.INITIATE_ORGANIZATION_PLAN_UPDATE, 'id'),
  receiveUpdatedPlan: makeActionCreator(ActionTypes.RECEIVE_UPDATED_ORGANIZATION_PLAN, 'id', 'plan'),
  // Seats
  initiateSeatsUpdate: makeActionCreator(ActionTypes.INITIATE_ORGANIZATION_SEATS_UPDATE, 'id'),
  receiveUpdatedSeats: makeActionCreator(ActionTypes.RECEIVE_UPDATED_ORGANIZATION_SEATS, 'id', 'seats'),
  receiveSeatsError: makeActionCreator(ActionTypes.RECEIVE_SEATS_ERROR),
  // Remove account
  initiateOrgRemoval: makeActionCreator(ActionTypes.INITIATE_ORGANIZATION_REMOVAL),
  receiveOrgRemoval: makeActionCreator(ActionTypes.RECEIVE_REMOVED_ORGANIZATION),
}

export const UI = {
  cancelConfirm: makeActionCreator(ActionTypes.UI_CANCEL_CONFIRMATION),
  completeConfirm: makeActionCreator(ActionTypes.UI_COMPLETE_CONFIRMATION),
  createTokenMode: makeActionCreator(ActionTypes.UI_CREATE_TOKEN_MODE, 'value'),
  createUserMode: makeActionCreator(ActionTypes.UI_CREATE_USER_MODE, 'value'),
  documentCreate: makeActionCreator(ActionTypes.UI_DOCUMENT_CREATE, 'value'),
  initiateConfirm: makeActionCreator(ActionTypes.UI_INITIATE_CONFIRMATION, 'message', 'cancelAction', 'confirmedAction', 'confirmedLabel', 'confirmedText'),
  toggleDocumentMode: makeActionCreator(ActionTypes.UI_DOCUMENT_MODE, 'value'),
  toggleFullScreen: makeActionCreator(ActionTypes.UI_DOCUMENT_FULL_SCREEN, 'value'),
  toggleStripeForm: makeActionCreator(ActionTypes.UI_TOGGLE_STRIPE_FORM, 'value'),
}

export const Search = {
  clearSearch: makeActionCreator(ActionTypes.SEARCH_CLEAR),
}
