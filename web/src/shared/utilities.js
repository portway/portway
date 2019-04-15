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
