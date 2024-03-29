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
  SORT_PROJECTS: 'SORT_PROJECTS',
  INITIATE_PROJECT_EXPORT: 'INITIATE_PROJECT_EXPORT',
  COMPLETE_PROJECT_EXPORT: 'COMPLETE_PROJECT_EXPORT',
  CLEAR_PROJECT_EXPORT_URL: 'CLEAR_PROJECT_EXPORT_URL',
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
  // Project Webhooks
  REQUEST_PROJECT_WEBHOOKS: 'REQUEST_PROJECT_WEBHOOKS',
  RECEIVE_PROJECT_WEBHOOKS: 'RECEIVE_PROJECT_WEBHOOKS',
  CREATE_PROJECT_WEBHOOK: 'CREATE_PROJECT_WEBHOOK',
  RECEIVE_CREATED_PROJECT_WEBHOOK: 'RECEIVE_CREATED_PROJECT_WEBHOOK',
  INITIATE_PROJECT_WEBHOOK_UPDATE: 'INITIATE_PROJECT_WEBHOOK_UPDATE',
  RECEIVE_UPDATED_PROJECT_WEBHOOK: 'RECEIVE_UPDATED_PROJECT_WEBHOOK',
  INITIATE_PROJECT_WEBHOOK_REMOVE: 'INITIATE_PROJECT_WEBHOOK_REMOVE',
  REMOVE_PROJECT_WEBHOOK: 'REMOVE_PROJECT_WEBHOOK',
  // Webhook Deliveries
  REQUEST_WEBHOOK_DELIVERIES: 'REQUEST_WEBHOOK_DELIVERIES',
  RECEIVE_WEBHOOK_DELIVERIES: 'RECEIVE_WEBHOOK_DELIVERIES',
  // Documents
  REQUEST_DOCUMENTS: 'REQUEST_DOCUMENTS',
  RECEIVE_DOCUMENTS: 'RECEIVE_DOCUMENTS',
  RECEIVE_DOCUMENTS_ERROR: 'RECEIVE_DOCUMENTS_ERROR',
  INITIATE_DOCUMENT_CREATE: 'INITIATE_DOCUMENT_CREATE',
  RECEIVE_CREATED_DOCUMENT: 'RECEIVE_CREATED_DOCUMENT',
  INITIATE_DOCUMENT_UPDATE: 'INITIATE_UPDATE_DOCUMENT',
  RECEIVE_UPDATED_DOCUMENT: 'RECEIVE_UPDATED_DOCUMENT',
  INITIATE_DOCUMENT_REMOVE: 'INITIATE_DOCUMENT_REMOVE',
  REMOVE_DOCUMENT: 'REMOVE_DOCUMENT',
  REQUEST_DOCUMENT: 'REQUEST_DOCUMENT',
  RECEIVE_DOCUMENT: 'RECEIVE_DOCUMENT',
  RECEIVE_DOCUMENT_ERROR: 'RECEIVE_DOCUMENT_ERROR',
  INITIATE_DOCUMENT_PUBLISH: 'INITIATE_DOCUMENT_PUBLISH',
  RECEIVE_PUBLISHED_DOCUMENT: 'RECEIVE_PUBLISHED_DOCUMENT',
  INITIATE_DOCUMENT_UNPUBLISH: 'INITIATE_DOCUMENT_UNPUBLISH',
  RECEIVE_UNPUBLISHED_DOCUMENT: 'RECEIVE_UNPUBLISHED_DOCUMENT',
  RECEIVE_DOCUMENT_RESULTS: 'RECEIVE_DOCUMENT_RESULTS',
  INITIATE_DOCUMENT_SEARCH: 'INITIATE_DOCUMENT_SEARCH',
  INITIATE_DOCUMENT_DUPLICATION: 'INITIATE_DOCUMENT_DUPLICATION',
  RECEIVE_DUPLICATED_DOCUMENT: 'RECEIVE_DUPLICATED_DOCUMENT',
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
  SET_LAST_CREATED_FIELD_ID: 'SET_LAST_CREATED_FIELD_ID',
  REMOVE_LAST_CREATED_FIELD_ID: 'REMOVE_LAST_CREATED_FIELD_ID',
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
  REQUEST_MULTIPLE_USERS: 'REQUEST_MULTIPLE_USERS',
  RECEIEVE_MULTIPLE_USERS: 'RECEIEVE_MULTIPLE_USERS',
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
  REQUEST_ORGANIZATION_SEATS: 'REQUEST_ORGANIZATION_SEATS',
  RECEIVE_ORGANIZATION_SEATS: 'RECEIVE_ORGANIZATION_SEATS',
  RECEIVE_ORGANIZATION_SPECIAL_PROJECT_ID: 'RECEIVE_ORGANIZATION_SPECIAL_PROJECT_ID',
  // UI
  UI_CANCEL_CONFIRMATION: 'UI_CANCEL_CONFIRMATION',
  UI_COMPLETE_CONFIRMATION: 'UI_COMPLETE_CONFIRMATION',
  UI_CREATE_TOKEN_MODE: 'UI_CREATE_TOKEN_MODE',
  UI_CREATE_USER_MODE: 'UI_CREATE_USER_MODE',
  UI_CREATE_WEBHOOK_MODE: 'UI_CREATE_WEBHOOK_MODE',
  UI_DOCUMENT_CREATE: 'UI_DOCUMENT_CREATE',
  UI_DOCUMENT_FULL_SCREEN: 'UI_DOCUMENT_FULL_SCREEN',
  UI_INITIATE_CONFIRMATION: 'UI_INITIATE_CONFIRMATION',
  // Search
  SEARCH_CLEAR: 'SEARCH_CLEAR',
  // User Sync
  DOCUMENT_ROOM_USERS_RECEIVED: 'DOCUMENT_ROOM_USERS_RECEIVED',
  EMIT_JOIN_DOCUMENT_ROOM: 'EMIT_JOIN_DOCUMENT_ROOM',
  EMIT_LEAVE_DOCUMENT_ROOM: 'EMIT_LEAVE_DOCUMENT_ROOM',
  EMIT_FIELD_FOCUS: 'EMIT_FIELD_FOCUS',
  EMIT_FIELD_BLUR: 'EMIT_FIELD_BLUR',
  EMIT_FIELD_CHANGE: 'EMIT_FIELD_CHANGE',
  SOCKET_ERROR: 'SOCKET_ERROR',
  DOCUMENT_ROOM_JOINED: 'DOCUMENT_ROOM_JOINED',
  DOCUMENT_ROOM_LEFT: 'DOCUMENT_ROOM_LEFT',
  FIELD_FOCUS_EMITTED: 'FIELD_FOCUS_EMITTED',
  FIELD_BLUR_EMITTED: 'FIELD_BLUR_EMITTED',
  FIELD_CHANGE_EMITTED: 'FIELD_CHANGE_EMITTED',
  REMOTE_USER_FIELD_FOCUS_UPDATED: 'USER_FIELD_FOCUS_UPDATED',
  REMOTE_FIELD_CHANGE_EVENT_RECEIVED: 'REMOTE_FIELD_CHANGE_EVENT_RECEIVED',
  // Organization Sync
  DOCUMENT_CREATED_EVENT_EMITTED: 'DOCUMENT_CREATED_EVENT_EMITTED',
  DOCUMENT_CREATED_EVENT_RECEIVED: 'DOCUMENT_CREATED_EVENT_RECEIVED',
  // Document Panel
  DOCUMENT_PANEL_TOGGLE: 'DOCUMENT_PANEL_TOGGLE',
  DOCUMENT_PANEL_TAB_SELECTION: 'DOCUMENT_PANEL_TAB_SELECTION',
  DOCUMENT_PANEL_FIELD_SELECTION: 'DOCUMENT_PANEL_FIELD_SELECTION',
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
  request: makeActionCreator(ActionTypes.REQUEST_PROJECTS, 'page'),
  receive: makeActionCreator(ActionTypes.RECEIVE_PROJECTS, 'data', 'page', 'totalPages'),
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
  receiveForUser: makeActionCreator(ActionTypes.RECEIVE_USER_PROJECTS, 'userId', 'data'),
  sort: makeActionCreator(ActionTypes.SORT_PROJECTS, 'sortBy', 'sortMethod'),
  initiateExport: makeActionCreator(ActionTypes.INITIATE_PROJECT_EXPORT, 'projectId'),
  completeExport: makeActionCreator(ActionTypes.COMPLETE_PROJECT_EXPORT, 'projectId', 'data'),
  clearExportUrl: makeActionCreator(ActionTypes.CLEAR_PROJECT_EXPORT_URL, 'projectId')
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

export const ProjectWebhooks = {
  request: makeActionCreator(ActionTypes.REQUEST_PROJECT_WEBHOOKS, 'projectId'),
  receive: makeActionCreator(ActionTypes.RECEIVE_PROJECT_WEBHOOKS, 'projectId', 'data', 'deliveries'),
  create: makeActionCreator(ActionTypes.CREATE_PROJECT_WEBHOOK, 'projectId'),
  receiveOneCreated: makeActionCreator(ActionTypes.RECEIVE_CREATED_PROJECT_WEBHOOK, 'data'),
  initiateUpdate: makeActionCreator(ActionTypes.INITIATE_PROJECT_WEBHOOK_UPDATE, 'projectId', 'webhookId'),
  receiveOneUpdated: makeActionCreator(ActionTypes.RECEIVE_UPDATED_PROJECT_WEBHOOK, 'projectId', 'webhookId', 'data'),
  initiateRemove: makeActionCreator(ActionTypes.INITIATE_PROJECT_WEBHOOK_REMOVE, 'projectId', 'webhookId'),
  removedOne: makeActionCreator(ActionTypes.REMOVE_PROJECT_WEBHOOK, 'projectId', 'webhookId'),
}

export const WebhookDeliveries = {
  request: makeActionCreator(ActionTypes.REQUEST_WEBHOOK_DELIVERIES, 'projectId', 'webhookId'),
  receive: makeActionCreator(ActionTypes.RECEIVE_WEBHOOK_DELIVERIES, 'projectId', 'webhookId', 'data'),
}

export const Documents = {
  create: makeActionCreator(ActionTypes.INITIATE_DOCUMENT_CREATE, 'projectId', 'data'),
  delete: makeActionCreator(ActionTypes.INITIATE_DOCUMENT_REMOVE, 'projectId', 'documentId'),
  deleted: makeActionCreator(ActionTypes.REMOVE_DOCUMENT, 'projectId', 'documentId'),
  publish: makeActionCreator(ActionTypes.INITIATE_DOCUMENT_PUBLISH, 'documentId'),
  receiveList: makeActionCreator(ActionTypes.RECEIVE_DOCUMENTS, 'projectId', 'data'),
  receiveListError: makeActionCreator(ActionTypes.RECEIVE_DOCUMENTS_ERROR, 'projectId'),
  receiveOne: makeActionCreator(ActionTypes.RECEIVE_DOCUMENT, 'data'),
  receiveError: makeActionCreator(ActionTypes.RECEIVE_DOCUMENT_ERROR, 'documentId'),
  receiveOneCreated: makeActionCreator(ActionTypes.RECEIVE_CREATED_DOCUMENT, 'projectId', 'data'),
  receiveOneUpdated: makeActionCreator(ActionTypes.RECEIVE_UPDATED_DOCUMENT, 'projectId', 'data'),
  receivePublishedVersion: makeActionCreator(ActionTypes.RECEIVE_PUBLISHED_DOCUMENT, 'projectId', 'data'),
  requestList: makeActionCreator(ActionTypes.REQUEST_DOCUMENTS, 'projectId'),
  requestOne: makeActionCreator(ActionTypes.REQUEST_DOCUMENT, 'documentId'),
  update: makeActionCreator(ActionTypes.INITIATE_DOCUMENT_UPDATE, 'projectId', 'documentId', 'data'),
  unpublish: makeActionCreator(ActionTypes.INITIATE_DOCUMENT_UNPUBLISH, 'documentId'),
  receiveUnpublishedVersion: makeActionCreator(ActionTypes.RECEIVE_UNPUBLISHED_DOCUMENT, 'projectId', 'data'),
  initiateSearch: makeActionCreator(ActionTypes.INITIATE_DOCUMENT_SEARCH, 'value'),
  receiveSearchResults: makeActionCreator(ActionTypes.RECEIVE_DOCUMENT_RESULTS, 'data'),
  duplicate: makeActionCreator(ActionTypes.INITIATE_DOCUMENT_DUPLICATION, 'projectId', 'documentId'),
  receiveDuplicatedDocument: makeActionCreator(ActionTypes.RECEIVE_DUPLICATED_DOCUMENT, 'projectId', 'data'),
}

export const Fields = {
  initiateCreate: makeActionCreator(ActionTypes.INITIATE_FIELD_CREATE, 'documentId', 'fieldType'),
  receiveOneCreated: makeActionCreator(ActionTypes.RECEIVE_CREATED_FIELD, 'projectId', 'documentId', 'data'),
  initiateOrderUpdate: makeActionCreator(ActionTypes.INITIATE_FIELD_ORDER, 'documentId', 'fieldId', 'newOrder'),
  initiateUpdate: makeActionCreator(ActionTypes.INITIATE_FIELD_UPDATE, 'documentId', 'fieldId'),
  receiveOneUpdated: makeActionCreator(ActionTypes.RECEIVE_UPDATED_FIELD, 'projectId', 'documentId', 'fieldId', 'data'),
  // Move & Copy
  initiateMove: makeActionCreator(ActionTypes.INITIATE_FIELD_MOVE, 'projectId', 'oldDocumentId', 'newDocumentId', 'fieldId'),
  movedField: makeActionCreator(ActionTypes.FIELD_MOVED, 'projectId', 'oldDocumentId', 'newDocumentId', 'fieldId'),
  initiateCopy: makeActionCreator(ActionTypes.INITIATE_FIELD_COPY, 'projectId', 'oldDocumentId', 'newDocumentId', 'fieldId'),
  copiedField: makeActionCreator(ActionTypes.FIELD_COPIED, 'projectId', 'oldDocumentId', 'newDocumentId', 'fieldId'),
  // Remove
  initiateRemove: makeActionCreator(ActionTypes.INITIATE_FIELD_REMOVE),
  removeOne: makeActionCreator(ActionTypes.REMOVE_FIELD, 'projectId', 'documentId', 'fieldId'),
  // Blur / Focus events
  blurField: makeActionCreator(ActionTypes.BLUR_FIELD, 'fieldId', 'fieldType', 'fieldData'),
  focusField: makeActionCreator(ActionTypes.FOCUS_FIELD, 'fieldId', 'fieldType', 'fieldData'),
  // Created field Id
  setLastCreatedFieldId: makeActionCreator(ActionTypes.SET_LAST_CREATED_FIELD_ID, 'fieldId'),
  // TODO: last created field id is not currently being un-set, use this to unset it if that causes
  // problems with focus in the future
  // removeLastCreatedFieldId: makeActionCreator(ActionTypes.REMOVE_LAST_CREATED_FIELD_ID, 'fieldId'),
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
  requestMultipleUnloadedIds: makeActionCreator(ActionTypes.REQUEST_MULTIPLE_USERS, 'userIds'),
  receiveMultipleIds: makeActionCreator(ActionTypes.RECEIEVE_MULTIPLE_USERS, 'data'),
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
  requestSeats: makeActionCreator(ActionTypes.REQUEST_ORGANIZATION_SEATS, 'id'),
  receiveSeats: makeActionCreator(ActionTypes.RECEIVE_ORGANIZATION_SEATS, 'id', 'seats'),
  // Remove account
  initiateOrgRemoval: makeActionCreator(ActionTypes.INITIATE_ORGANIZATION_REMOVAL),
  receiveOrgRemoval: makeActionCreator(ActionTypes.RECEIVE_REMOVED_ORGANIZATION),
  // Special project ID
  receiveSpecialProjectId: makeActionCreator(ActionTypes.RECEIVE_ORGANIZATION_SPECIAL_PROJECT_ID, 'orgId', 'projectId'),
}

export const UI = {
  cancelConfirm: makeActionCreator(ActionTypes.UI_CANCEL_CONFIRMATION),
  completeConfirm: makeActionCreator(ActionTypes.UI_COMPLETE_CONFIRMATION),
  createTokenMode: makeActionCreator(ActionTypes.UI_CREATE_TOKEN_MODE, 'value'),
  createWebhookMode: makeActionCreator(ActionTypes.UI_CREATE_WEBHOOK_MODE, 'value'),
  createUserMode: makeActionCreator(ActionTypes.UI_CREATE_USER_MODE, 'value'),
  documentCreate: makeActionCreator(ActionTypes.UI_DOCUMENT_CREATE, 'value'),
  initiateConfirm: makeActionCreator(ActionTypes.UI_INITIATE_CONFIRMATION, 'message', 'options'),
  toggleFullScreen: makeActionCreator(ActionTypes.UI_DOCUMENT_FULL_SCREEN, 'value'),
}

export const Search = {
  clearSearch: makeActionCreator(ActionTypes.SEARCH_CLEAR),
}

export const UserSync = {
  documentRoomUsersReceived: makeActionCreator(ActionTypes.DOCUMENT_ROOM_USERS_RECEIVED, 'documentId', 'userIds'),
  emitJoinDocumentRoom: makeActionCreator(ActionTypes.EMIT_JOIN_DOCUMENT_ROOM, 'documentId'),
  emitLeaveDocumentRoom: makeActionCreator(ActionTypes.EMIT_LEAVE_DOCUMENT_ROOM, 'documentId'),
  emitFieldFocus: makeActionCreator(ActionTypes.EMIT_FIELD_FOCUS, 'fieldId'),
  emitFieldBlur: makeActionCreator(ActionTypes.EMIT_FIELD_BLUR, 'fieldId'),
  emitFieldChange: makeActionCreator(ActionTypes.EMIT_FIELD_CHANGE, 'fieldId'),
  socketError: makeActionCreator(ActionTypes.SOCKET_ERROR),
  documentRoomJoined: makeActionCreator(ActionTypes.DOCUMENT_ROOM_JOINED, 'documentId'),
  documentRoomLeft: makeActionCreator(ActionTypes.DOCUMENT_ROOM_LEFT, 'documentId'),
  fieldFocusEmitted: makeActionCreator(ActionTypes.FIELD_FOCUS_EMITTED, 'fieldId'),
  fieldBlurEmitted: makeActionCreator(ActionTypes.FIELD_BLUR_EMITTED, 'fieldId'),
  fieldChangeEmitted: makeActionCreator(ActionTypes.FIELD_CHANGE_EMITTED, 'fieldId'),
  remoteUserFieldFocusUpdated: makeActionCreator(ActionTypes.REMOTE_USER_FIELD_FOCUS_UPDATED, 'userId', 'fieldId'),
  remoteFieldChangeEventReceived: makeActionCreator(ActionTypes.REMOTE_FIELD_CHANGE_EVENT_RECEIVED, 'userId', 'fieldId', 'focusedFieldId')
}

export const OrganizationSync = {
  documentCreatedEventEmitted: makeActionCreator(ActionTypes.DOCUMENT_CREATED_EVENT_EMITTED, 'projectId'),
  documentCreatedEventReceived: makeActionCreator(ActionTypes.DOCUMENT_CREATED_EVENT_RECEIVED, 'projectId'),
  socketError: makeActionCreator(ActionTypes.SOCKET_ERROR)
}

export const DocumentPanel = {
  togglePanel: makeActionCreator(ActionTypes.DOCUMENT_PANEL_TOGGLE, 'value'),
  selectTab: makeActionCreator(ActionTypes.DOCUMENT_PANEL_TAB_SELECTION, 'value'),
  selectField: makeActionCreator(ActionTypes.DOCUMENT_PANEL_FIELD_SELECTION, 'value'),
}
