import actions from '../../constants/actions'
import resourceTypes from '../../constants/resourceTypes'

export default function(roles, resourceType, action) {
  if (!resourceTypes[resourceType]) {
    throw new Error(
      `ResourceType ${resourceType} does not exist.` +
      'Define resource types in constants/resourceTypes'
    )
  }

  if (!actions[action]) {
    throw new Error(`Action ${action} does not exist. Define actions in constants/actions`)
  }

  if (!Array.isArray(roles)) {
    roles = [roles]
  }
  const hasRole = roles.find((role) => {
    return role[resourceType] && role[resourceType][action]
  })

  return Boolean(hasRole)
}