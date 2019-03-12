import { useEffect } from 'react'

function useBlur(ref, callback) {
  useEffect(() => {
    let timeOutId
    const currentRef = ref.current

    function blurHandler() {
      timeOutId = setTimeout(() => {
        callback()
      })
    }

    function focusHandler() {
      clearTimeout(timeOutId)
    }

    currentRef.addEventListener('focusout', blurHandler, false)
    currentRef.addEventListener('focusin', focusHandler, false)
    return () => {
      currentRef.removeEventListener('focusout', blurHandler, false)
      currentRef.removeEventListener('focusin', focusHandler, false)
    }
  }, [ref, callback])
}

export default useBlur
