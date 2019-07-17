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
 * @param [Array] dependencies
 *   Optionally define dependencies for when data should be refetched, such as an id
 * @return [Object] resourceData
 *   [Mixed] data: result of getDataFromState func
 *   [Mixed|Boolean] loading: current loading status result from getLoadingStatusFromState
 * [Mixed|Array] data
 *   Returns data from getDataFromState function
 * useDataService(dataFuncs[, dependencies])
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
    let mounted = true
    const loading = getLoadingStatusFromState(Store.getState())
    setLoading(loading)
    console.log("HERE", loading)
    if (loading == null) {
      Store.dispatch(fetchAction)
    }

    function handleStateChange() {
      if (!mounted) return

      const state = Store.getState()
      const loading = getLoadingStatusFromState(state)

      if (loading === false && mounted) {
        const data = getDataFromState(state)
        setData(data)
      }

      setLoading(loading)
    }

    const unsubscribeFn = Store.subscribe(handleStateChange)
    handleStateChange()

    return () => {
      mounted = false
      unsubscribeFn()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  return { data: exposedData, loading: exposedLoading }
}
