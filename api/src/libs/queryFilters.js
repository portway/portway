import { SORT_METHODS } from '../constants/queryOptions'

export function getPaginationOptions(page, perPage) {
  if (!page || !perPage) {
    return {}
  }

  return { limit: perPage, offset: (page - 1) * perPage }
}

export function getSortOptions(sortBy = 'createdAt', sortMethod = SORT_METHODS.ASCENDING) {
  return { order: [[sortBy, sortMethod]] }
}
