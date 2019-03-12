/**
 * Use in conjuction with libs/dataMapper to subscribe to a resource
 * view. If the view is not loaded in the Redux store, the resource
 * view will be fetched from the API
 *
 * To add a resource view, add it dataMapper
 *
 * @param [Object] dataFuncs
 *   [Function] getDataFromState(state): [Mixed] data
 *   [Function] getLoadingStatusFromState(state): [Boolean|Undefined|Null] status
 *   [Function] fetchAction: [Function] dispatchAction
 * @param [Boolean] returnLoadingStatus
 *   Optionally return data and loading status
 * @return [Mixed|Array] data
 *   Returns data from getDataFromState function. If returnLoadingStatus is true,
 *   returns an array with two values, data and loading status from getLoadingStatusFromState: [data, loadingStatus]
 * useDataService(dataFuncs[, returnLoadingStatus])
 *
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

export default function useDataService(
  { getDataFromState, getLoadingStatusFromState, fetchAction },
  dependencies = []
) {
  // Callback arg to useState() only runs once!
  const [exposedData, setData] = useState(() => {
    const state = Store.getState()
    return getDataFromState(state)
  })
  const [exposedLoading, setLoading] = useState(() => {
    const state = Store.getState()
    return getLoadingStatusFromState(state)
  })

  useEffect(() => {
    const loading = getLoadingStatusFromState(Store.getState())
    setLoading(loading)

    if (loading == null) {
      Store.dispatch(fetchAction)
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

    const unsubsubscribeFn = Store.subscribe(handleStateChange)
    handleStateChange()

    return () => {
      unsubsubscribeFn()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  return { data: exposedData, loading: exposedLoading }
}
