import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { uiConfirmCancel, uiConfirmComplete } from 'Actions/ui'
import ConfirmationComponent from './ConfirmationComponent'

const ConfirmationContainer = ({ confirmation, uiConfirmCancel, uiConfirmComplete }) => {
  if (confirmation.confirming) {
    return (
      <ConfirmationComponent
        message={confirmation.message}
        cancelAction={() => {
          if (confirmation.cancelAction) {
            confirmation.cancelAction()
          }
          uiConfirmCancel()
        }}
        confirmedAction={() => {
          confirmation.confirmedAction()
          uiConfirmComplete()
        }}
        confirmedLabel={confirmation.confirmedLabel}
      />
    )
  } else {
    return null
  }
}

ConfirmationContainer.propTypes = {
  confirmation: PropTypes.object.isRequired,
  uiConfirmCancel: PropTypes.func.isRequired,
  uiConfirmComplete: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    confirmation: state.ui.confirmation
  }
}

const mapDispatchToProps = { uiConfirmCancel, uiConfirmComplete }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmationContainer)
