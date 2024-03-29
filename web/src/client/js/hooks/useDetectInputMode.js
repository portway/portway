import { useEffect } from 'react'

// Don't adjust input method if it's a certain type of field
const inputTypesThatShouldntReturnTrue = ['text', 'password', 'email', 'number', 'search']

// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
// Test via a getter in the options object to see if the passive property is accessed
let supportsPassive = false
try {
  const opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true
    }
  })
  window.addEventListener('testPassive', null, opts)
  window.removeEventListener('testPassive', null, opts)
  // eslint-disable-next-line no-empty
} catch (e) {}

function useDetectInputMode() {
  useEffect(() => {
    function mouseDownHandler() {
      document.body.classList.add('using-mouse')
    }
    function keyDownHandler(e) {
      if (inputTypesThatShouldntReturnTrue.includes(e.target.type)) return
      if (e.target.classList.contains('btn--form')) return
      if (e.target.classList.contains('btn--menu-item')) return
      if (e.key && e.key.toLowerCase() !== 'meta') {
        document.body.classList.remove('using-mouse')
      }
    }
    document.addEventListener(
      'touchstart', mouseDownHandler, supportsPassive ? { passive: true } : false
    )
    document.addEventListener('mousedown', mouseDownHandler, false)
    document.addEventListener('keydown', keyDownHandler, false)
    return () => {
      document.removeEventListener(
        'touchstart', mouseDownHandler, supportsPassive ? { passive: true } : false
      )
      document.removeEventListener('mousedown', mouseDownHandler, false)
      document.removeEventListener('keydown', keyDownHandler, false)
    }
  }, [])
}

export default useDetectInputMode
