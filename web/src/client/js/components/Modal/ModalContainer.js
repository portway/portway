import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { MODAL_TYPES } from 'Shared/constants'
import { hideModal } from 'Actions/modal'

import { RemoveIcon } from 'Components/Icons'
import { IconButton } from 'Components/Buttons/'
import useClickOutside from 'Hooks/useClickOutside'
import DocumentInfoModal from './types/DocumentInfoModal'

import './ModalStyles.scss'

const MODAL_COMPONENTS = {
  [MODAL_TYPES.DOCUMENT_INFO]: DocumentInfoModal
}

const ModalContainer = ({ hideModal, modalProps, modalType }) => {
  const modalRef = useRef()
  useClickOutside(modalRef, hideModal)

  if (!modalType) return null

  const ModalToRender = MODAL_COMPONENTS[modalType]
  return (
    <div className="modal">
      <div className="modal__content" ref={modalRef}>
        <ModalToRender {...modalProps} />
        <IconButton className="modal__close" onClick={hideModal}>
          <RemoveIcon width="14" height="14" />
        </IconButton>
      </div>
    </div>
  )
}

ModalContainer.propTypes = {
  hideModal: PropTypes.func.isRequired,
  modalProps: PropTypes.object,
  modalType: PropTypes.string,
}

const mapStateToProps = (state) => {
  return {
    modalProps: state.modal.modalProps,
    modalType: state.modal.modalType,
  }
}

const mapDispatchToProps = { hideModal }

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer)
