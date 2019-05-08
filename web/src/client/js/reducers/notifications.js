import { ActionTypes } from '../actions'

const initialState = {
  notices: []
}

export const notifications = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CREATE_NOTIFICATION: {
      const { noticeType, code, message } = action
      const notice = {
        type: noticeType,
        code: code,
        message: message
      }
      return {
        ...state,
        notices: [
          ...state.notices,
          notice
        ]
      }
    }
    default:
      return state
  }
}
