import { useEffect } from 'react'

function useClickOutside(ref, callback) {
  useEffect(() => {
    function mouseDownHandler(e) {
      if (ref && ref.current) {
        if (ref.current.contains(e.target)) {
          return
        }
        callback()
      }
    }
    function keyDownHandler(e) {
      if (ref && ref.current) {
        if (e.keyCode === 27) { // escape
          callback()
        }
      }
    }
    document.addEventListener('mousedown', mouseDownHandler, false)
    document.addEventListener('keydown', keyDownHandler, false)
    return () => {
      document.removeEventListener('mousedown', mouseDownHandler, false)
      document.removeEventListener('keydown', keyDownHandler, false)
    }
  }, [callback, ref])
}

export default useClickOutside
