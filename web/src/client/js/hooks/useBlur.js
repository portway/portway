import { useEffect } from 'react'

function useBlur(ref, callback) {
  useEffect(() => {
    let timeOutId
    if (!ref.current) return
    const currentRef = ref.current

    function blurHandler() {
      if (document.body.classList.contains('using-mouse')) return
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
