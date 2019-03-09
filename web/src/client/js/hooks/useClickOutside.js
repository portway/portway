import { useState, useEffect } from 'react'

function useClickOutside(ref, dispatch, action) {
  const [clicked, setClicked] = useState(false)

  function mouseDownHandler(e) {
    if (ref && ref.current) {
      if (ref.current.contains(e.target)) {
        return
      }
      setClicked(true)
      dispatch(action)
    }
    return
  }

  useEffect(() => {
    document.addEventListener('mousedown', mouseDownHandler, false)
    return () => {
      document.removeEventListener('mousedown', mouseDownHandler, false)
    }
  })

  return clicked
}

export default useClickOutside
