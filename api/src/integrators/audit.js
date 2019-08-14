// Controller audit log integrator
// receives an object with namespace info
// currently logging to the console

export default function auditLog({
  userId,
  primaryModel,
  primaryId,
  secondaryModel,
  secondaryId,
  action
}) {
  if (!typeof primaryModel === 'string') {
    throw new Error('Could not log audit data, primary model is required')
  }

  let message
  const primaryDisplayModel = primaryModel.toLowerCase()
  const secondaryDisplayModel = secondaryModel && secondaryModel.toLowerCase()

  switch (action) {
    case auditActions.ADDED_PRIMARY:
      message = `added ${primaryDisplayModel}`
      break
    case auditActions.ADDED_PRIMARY_TO_SECONDARY:
      message = `added ${primaryDisplayModel} to ${secondaryDisplayModel}`
      break
    case auditActions.UPDATED_PRIMARY:
      message = `updated ${primaryDisplayModel}`
      break
    case auditActions.UPDATED_PRIMARY_FOR_SECONDARY:
      message = `updated ${primaryDisplayModel} for ${secondaryDisplayModel}`
      break
    case auditActions.REMOVED_PRIMARY:
      message = `removed ${primaryDisplayModel}`
      break
    case auditActions.REMOVED_PRIMARY_FROM_SECONDARY:
      message = `removed ${primaryDisplayModel} from ${secondaryDisplayModel}`
      break
  }

  console.info('AUDIT:', JSON.stringify({
    userId,
    timestamp: Date.now(),
    message,
    primaryModel,
    primaryId,
    secondaryModel,
    secondaryId
  }))
}

export const auditActions = {
  ADDED_PRIMARY: 'ADDED_PRIMARY',
  ADDED_PRIMARY_TO_SECONDARY: 'ADDED_PRIMARY_TO_SECONDARY',
  UPDATED_PRIMARY: 'UPDATED_PRIMARY',
  UPDATED_PRIMARY_FOR_SECONDARY: 'UPDATED_PRIMARY_FOR_SECONDARY',
  REMOVED_PRIMARY: 'REMOVED_PRIMARY',
  REMOVED_PRIMARY_FROM_SECONDARY: 'REMOVED_PRIMARY_FROM_SECONDARY'
}
