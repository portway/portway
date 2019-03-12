/**
 * Use in conjuction with libs/dataMapper to subscribe to a resource
 * view. If the view is not loaded in the Redux store, the resource
 * view will be fetched from the API
 *
 * To add a resource view, add it dataMapper
 *
 * Example Usage in a React Component:
 * function MyComponent() {
 *   const data = useDataService(dataMapper.projects.list())
 *   // Do anything with projects list view data now
 * }
 *
 */
import { useEffect, useState } from 'react'
import Store from '../reducers'

export default function useDataService({
  getDataFromState,
  getLoadingStatusFromState,
  fetchAction
}) {
  // Callback arg to useState() only runs once!
  const [data, setData] = useState(() => {
    const state = Store.getState()
    return getDataFromState(state)
  })
  const [loading, setLoading] = useState(() => {
    const state = Store.getState()
    return getLoadingStatusFromState(state)
  })

  // Catches null or undefined
  if (loading == null) {
    Store.dispatch(fetchAction())
  }

  function handleStateChange() {
    const state = Store.getState()
    const loading = getLoadingStatusFromState(state)
    setLoading(loading)
    if (loading === false) {
      const data = getDataFromState(state)
      setData(data)
    }
  }

  useEffect(() => {
    const unsubsubscribeFn = Store.subscribe(handleStateChange)
    return () => {
      unsubsubscribeFn()
    }
  }, []) // 2nd empty array arg means only run on mount/unmount

  return data
}
