import { useEffect } from 'react'

function useWindowResize(callback) {
  useEffect(() => {
    let resizeTimer
    function resizeHandler(e) {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        callback()
      }, 250)
    }
    window.addEventListener('resize', resizeHandler, false)
    return () => {
      window.removeEventListener('resize', resizeHandler, false)
    }
  }, [callback])
}

export default useWindowResize
