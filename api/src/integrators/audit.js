// Controller audit log integrator
// receives an object with namespace info
// currently logging to the console

export default function auditLog({
  userId,
  primaryModel = '',
  primaryId,
  secondaryModel = '',
  secondaryId,
  action
}) {
  let message

  switch (action) {
    case auditActions.ADDED_PRIMARY:
      message = `added ${primaryModel.toLowerCase()}`
      break
    case auditActions.ADDED_PRIMARY_TO_SECONDARY:
      message = `added ${primaryModel.toLowerCase()} to ${secondaryModel.toLowerCase()}`
      break
    case auditActions.UPDATED_PRIMARY:
      message = `updated ${primaryModel.toLowerCase()}`
      break
    case auditActions.DELETED_PRIMARY:
      message = `deleted ${primaryModel.toLowerCase()}`
      break
    case auditActions.DELETED_PRIMARY_FROM_SECONDARY:
      message = `deleted ${primaryModel.toLowerCase()} from ${secondaryModel.toLowerCase()}`
      break
  }

  console.info({
    userId,
    timestamp: Date.now(),
    message,
    primaryModel,
    primaryId,
    secondaryModel,
    secondaryId
  })
}

export const auditActions = {
  ADD_PRIMARY: 'ADD_PRIMARY',
  ADD_SECONDARY: 'ADD_SECONDARY',
  UPDATE_PRIMARY: 'UPDATE_PRIMARY',
  DELETE_PRIMARY: 'DELETE_PRIMARY',
  DELETE_PRIMARY_FROM_SECONDARY: 'DELETE_PRIMARY_FROM_SECONDARY'
}
