import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import SpinnerComponent from './SpinnerComponent'

const SpinnerContainer = ({ color, height, message, spinning, width }) => {
  if (spinning) {
    return <SpinnerComponent color={color} height={height} message={message} width={width} />
  } else {
    return null
  }
}

SpinnerContainer.propTypes = {
  color: PropTypes.string,
  height: PropTypes.string,
  message: PropTypes.string,
  spinning: PropTypes.bool,
  width: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    spinning: state.ui.spinner.spinning
  }
}

export default connect(mapStateToProps)(SpinnerContainer)
