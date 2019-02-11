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
  return function() {
    if (isRunning) return
    isRunning = true
    window.requestAnimationFrame(() => {
      action()
      isRunning = false
    })
  }
}
