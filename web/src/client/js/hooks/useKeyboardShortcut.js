import { useEffect } from 'react'

function useKeyboardShortcut(key, callback) {
  useEffect(() => {
    function keyDownHandler(e) {
      if (e.ctrlKey && e.key === key) {
        callback()
      }
    }
    document.addEventListener('keydown', keyDownHandler, false)
    return () => {
      document.removeEventListener('keydown', keyDownHandler, false)
    }
  }, [callback, key])
}

export default useKeyboardShortcut
