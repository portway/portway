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
  dependencies
) {
  // Callback arg to useState() only runs once!
  const [data, setData] = useState(() => {
    const state = Store.getState()
    return getDataFromState(state)
  })
  const [loading, setLoading] = useState(() => {
    const state = Store.getState()
    return getLoadingStatusFromState(state)
  })

  useEffect(() => {
    const loading = getLoadingStatusFromState(Store.getState())

    // Catches null or undefined
    if (loading == null) {
      Store.dispatch(fetchAction)
    }

    function handleStateChange() {
      console.log('useDataService hook handle store update')
      const state = Store.getState()
      const loading = getLoadingStatusFromState(state)
      setLoading(loading)
      console.log({ loading })
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
  }, [fetchAction, getDataFromState, getLoadingStatusFromState])

  return data
}
