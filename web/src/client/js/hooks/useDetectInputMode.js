import { useEffect } from 'react'

function useDetectInputMode() {
  useEffect(() => {
    function mouseDownHandler() {
      document.body.classList.add('using-mouse')
    }
    function keyDownHandler() {
      document.body.classList.remove('using-mouse')
    }
    document.addEventListener('touchstart', mouseDownHandler, false)
    document.addEventListener('mousedown', mouseDownHandler, false)
    document.addEventListener('keydown', keyDownHandler, false)
    return () => {
      document.removeEventListener('touchstart', mouseDownHandler, false)
      document.removeEventListener('mousedown', mouseDownHandler, false)
      document.removeEventListener('keydown', keyDownHandler, false)
    }
  }, [])
}

export default useDetectInputMode
