import { Modal } from './index'

export const showModal = (modalType, modalProps) => {
  return async (dispatch) => {
    dispatch(Modal.show(modalType, modalProps))
  }
}

export const hideModal = () => {
  return async (dispatch) => {
    dispatch(Modal.hide())
  }
}
