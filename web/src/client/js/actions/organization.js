import { Organizations, Notifications, Validation } from './index'
import { formSubmitAction, formSucceededAction, formFailedAction } from './form'
import { add, fetch, update, globalErrorCodes, validationCodes } from '../api'
import { NOTIFICATION_TYPES, NOTIFICATION_RESOURCE, PATH_BILLING } from 'Shared/constants'

export const fetchOrganization = (orgId) => {
  return async (dispatch) => {
    dispatch(Organizations.requestOne(orgId))
    // Get the org and the org's special project Id
    const results = await Promise.all([fetch(`v1/organizations/${orgId}`), fetch(`v1/organizations/${orgId}/introProjectId`)])
    const { data, status } = results[0]
    const { data: specialProjectId } = results[1]
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.ORGANIZATION, status))
      return
    }
    dispatch(Organizations.receiveOne(data))
    dispatch(Organizations.receiveSpecialProjectId(orgId, specialProjectId))
  }
}

export const updateOrganization = (formId, orgId, body) => {
  return async (dispatch) => {
    dispatch(formSubmitAction(formId))
    dispatch(Organizations.initiateUpdate(orgId))
    const { data, status } = await update(`v1/organizations/${orgId}`, body)
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
    const { data, status } = await update(`v1/organizations/${orgId}/avatar`, formData)
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

export const fetchOrganizationSeats = (orgId) => {
  return async (dispatch) => {
    dispatch(Organizations.requestSeats(orgId))
    const { data, status } = await fetch(`v1/organizations/${orgId}/seats`)
    if (globalErrorCodes.includes(status)) {
      dispatch(
        Notifications.create(
          data.error,
          NOTIFICATION_TYPES.ERROR,
          NOTIFICATION_RESOURCE.ORGANIZATION,
          status
        )
      )
      return
    }
    dispatch(Organizations.receiveSeats(orgId, data))
  }
}

export const fetchOrganizationBilling = (orgId) => {
  return async (dispatch) => {
    dispatch(Organizations.requestBilling(orgId))
    const { data, status } = await fetch(`v1/organizations/${orgId}/billing`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.ORGANIZATION, status))
      return
    }
    dispatch(Organizations.receiveBilling(orgId, data))
  }
}

export const updateOrganizationBilling = (orgId, history, body) => {
  return async (dispatch) => {
    dispatch(Organizations.initiateBillingUpdate(orgId))
    const { data, status } = await update(`v1/organizations/${orgId}/billing`, body)
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
    dispatch(fetchOrganization(orgId))
    history.push({ pathname: PATH_BILLING })
  }
}

export const updateOrganizationPlan = (formId, orgId, body) => {
  return async (dispatch) => {
    dispatch(formSubmitAction(formId))
    dispatch(Organizations.initiatePlanUpdate(orgId))
    const { data, status } = await update(`v1/organizations/${orgId}/plan`, body)
    if (validationCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Validation.create('organization', data, status))
      dispatch(Organizations.receiveBillingError())
      return
    }
    if (globalErrorCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.ORGANIZATION, status))
      return
    }
    dispatch(Organizations.receiveUpdatedPlan(orgId, body.plan))
    dispatch(formSucceededAction(formId))
    dispatch(fetchOrganizationBilling(orgId))
  }
}

export const updateOrganizationSeats = (formId, orgId, body) => {
  return async (dispatch) => {
    dispatch(formSubmitAction(formId))
    dispatch(Organizations.initiateSeatsUpdate(orgId))
    const { data, status } = await update(`v1/organizations/${orgId}/seats`, body)
    if (validationCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Validation.create('organization', data, status))
      dispatch(Organizations.receiveSeatsError())
      return
    }
    if (globalErrorCodes.includes(status)) {
      dispatch(formFailedAction(formId))
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.ORGANIZATION, status))
      return
    }
    dispatch(Organizations.receiveUpdatedSeats(orgId, body.seats))
    dispatch(fetchOrganization(orgId))
    dispatch(fetchOrganizationBilling(orgId))
    dispatch(formSucceededAction(formId))
  }
}

export const deleteOrganization = (orgId) => {
  return async (dispatch) => {
    dispatch(Organizations.initiateOrgRemoval(orgId))
    const { data, status } = await add(`v1/organizations/${orgId}/billing/cancel`, orgId)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.ORGANIZATION, status))
      return
    }
    dispatch(Organizations.receiveOrgRemoval(orgId))
    dispatch(fetchOrganization(orgId))
    dispatch(fetchOrganizationBilling(orgId))
  }
}
