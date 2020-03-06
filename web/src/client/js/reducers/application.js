import { ActionTypes } from '../actions'
import { NETWORK_STATUS } from 'Shared/constants'

const initialState = {
  network: NETWORK_STATUS.ONLINE,
}

export const application = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.NETWORK_STATUS_CHANGE: {
      return { ...state, network: action.status }
    }
    default: {
      return state
    }
  }
}
