import { UI } from './index'

export const documentCreate = (value) => {
  return async (dispatch) => {
    dispatch(UI.documentCreate(value))
  }
}
