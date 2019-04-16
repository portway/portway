import { useEffect } from 'react'

function useClickOutside(ref, callback, options = {}) {
  useEffect(() => {
    function mouseDownHandler(e) {
      if (ref && ref.current) {
        if (ref.current.contains(e.target)) {
          return
        }
      }
      callback()
    }
    function keyDownHandler(e) {
      // Escape key should collapse things too
      if (ref && ref.current && e.keyCode === 27) {
        callback()
      }
    }
    document.addEventListener('mousedown', mouseDownHandler, false)
    if (!options.preventEscapeFunctionality) {
      document.addEventListener('keydown', keyDownHandler, false)
    }
    return () => {
      document.removeEventListener('mousedown', mouseDownHandler, false)
      if (!options.preventEscapeFunctionality) {
        document.removeEventListener('keydown', keyDownHandler, false)
      }
    }
  }, [callback, ref, options])
}

export default useClickOutside
