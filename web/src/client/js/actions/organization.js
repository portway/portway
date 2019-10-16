import { Organizations, Notifications, Validation } from './index'
import { formSubmitAction, formSucceededAction, formFailedAction } from './form'
import { fetch, update, globalErrorCodes, validationCodes } from '../api'
import { NOTIFICATION_TYPES, NOTIFICATION_RESOURCE } from 'Shared/constants'

export const fetchOrganization = (orgId) => {
  return async (dispatch) => {
    dispatch(Organizations.requestOne(orgId))
    const { data, status } = await fetch(`organizations/${orgId}`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.ORGANIZATION, status))
      return
    }
    dispatch(Organizations.receiveOne(data))
  }
}

export const updateOrganization = (formId, orgId, body) => {
  return async (dispatch) => {
    dispatch(formSubmitAction(formId))
    dispatch(Organizations.initiateUpdate(orgId))
    const { data, status } = await update(`organizations/${orgId}`, body)
    if (globalErrorCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.ORGANIZATION, status))
      return
    }
    if (validationCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Validation.create('organization', data, status))
    } else {
      dispatch(formSucceededAction(formId))
      dispatch(Organizations.receiveOneUpdated(data))
    }
  }
}

export const updateOrganizationAvatar = (formId, orgId, formData) => {
  return async (dispatch) => {
    dispatch(formSubmitAction(formId))
    dispatch(Organizations.initiateUpdate(orgId))
    const { data, status } = await update(`organizations/${orgId}/avatar`, formData)
    if (globalErrorCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.ORGANIZATION, status))
      return
    }
    if (validationCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Validation.create('organization', data, status))
    } else {
      dispatch(formSucceededAction(formId))
      dispatch(Organizations.receiveUpdatedAvatar(orgId, data))
    }
  }
}

export const fetchOrganizationBilling = (orgId) => {
  return async (dispatch) => {
    dispatch(Organizations.requestBilling(orgId))
    const { data, status } = await fetch(`organizations/${orgId}/billing`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.ORGANIZATION, status))
      return
    }
    dispatch(Organizations.receiveBilling(orgId, data))
  }
}

export const updateOrganizationBilling = (orgId, body) => {
  return async (dispatch) => {
    dispatch(Organizations.initiateBillingUpdate(orgId))
    const { data, status } = await update(`organizations/${orgId}/billing`, body)
    if (validationCodes.includes(status)) {
      dispatch(Validation.create('organization', data, status))
      dispatch(Organizations.receiveBillingError())
      return
    }
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.ORGANIZATION, status))
      return
    }
    dispatch(Organizations.receiveUpdatedBilling(orgId, data))
  }
}

export const updateOrganizationPlan = (formId, orgId, body) => {
  return async (dispatch) => {
    dispatch(formSubmitAction(formId))
    dispatch(Organizations.initiatePlanUpdate(orgId))
    const { data, status } = await update(`organizations/${orgId}/plan`, body)
    if (globalErrorCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.ORGANIZATION, status))
      return
    }
    dispatch(Organizations.receiveUpdatedPlan(orgId, body.plan))
    dispatch(formSucceededAction(formId))
  }
}
