import { useEffect } from 'react'

function useBlur(ref, dispatch, action) {
  let timeOutId

  function blurHandler() {
    timeOutId = setTimeout(() => {
      dispatch(action)
    })
  }

  function focusHandler() {
    clearTimeout(timeOutId)
  }

  useEffect(() => {
    ref.current.addEventListener('focusout', blurHandler, false)
    ref.current.addEventListener('focusin', focusHandler, false)
    return () => {
      ref.current.removeEventListener('focusout', blurHandler, false)
      ref.current.removeEventListener('focusin', focusHandler, false)
    }
  })
}

export default useBlur
