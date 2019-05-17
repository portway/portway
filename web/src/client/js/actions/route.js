import { Route } from './index'

export const routeChange = () => {
  return async (dispatch) => {
    dispatch(Route.change())
  }
}
