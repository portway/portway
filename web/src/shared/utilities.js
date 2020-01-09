import { FIELD_LABELS } from 'Shared/constants'

export const debounce = function(delay, fn) {
  let timerId
  return function(...args) {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      fn(...args)
      timerId = null
    }, delay)
  }
}

export const throttle = function(action) {
  let isRunning = false
  return function(...args) {
    if (isRunning) return
    isRunning = true
    window.requestAnimationFrame(() => {
      action(...args)
      isRunning = false
    })
  }
}

export const groupBy = function(list, property) {
  if (!list.reduce) { list = Object.values(list) }
  return list.reduce((object, listItem) => {
    const key = listItem[property]
    if (!object[key]) {
      object[key] = []
    }
    object[key].push(listItem)
    return object
  }, {})
}

/**
 * Returns a name for a new field prepended by the number of fields of that type
 * This is used in places like the ContentMenu and the BigInvisibleButton™
 */
export const getNewNameInSequence = function(fields, fieldType) {
  let fieldsByType
  if (fields) {
    fieldsByType = groupBy(fields, 'type')
  } else {
    fieldsByType = {}
  }
  const typeFieldsInDocument = fieldsByType[fieldType]
  const value = typeFieldsInDocument ? typeFieldsInDocument.length : 0
  return FIELD_LABELS[fieldType] + (value + 1)
}

export const isAnyPartOfElementInViewport = function(el) {
  const rect = el.getBoundingClientRect()
  const windowHeight = (window.innerHeight || document.documentElement.clientHeight)
  const windowWidth = (window.innerWidth || document.documentElement.clientWidth)

  // http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
  const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0)
  const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0)

  return (vertInView && horInView)
}
