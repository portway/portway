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
    document.addEventListener('mousedown', mouseDownHandler, false)
    return () => {
      document.removeEventListener('mousedown', mouseDownHandler, false)
    }
  }, [callback, ref])
}

export default useClickOutside
