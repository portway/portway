import { useEffect, useRef } from 'react'

// https://stackoverflow.com/questions/58773210/trying-to-use-cleanup-function-in-useeffect-hook-to-cleanup-img-onload
function useIsMounted() {
  const isMounted = useRef(true)
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  return isMounted
}

export default useIsMounted
