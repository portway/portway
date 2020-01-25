import React from 'react'
import PropTypes from 'prop-types'

import './Spinner.scss'

const SpinnerComponent = ({ color, height, message, width }) => {
  const spinnerStyle = {
    height: `${height}px`,
    width: `${width}px`
  }
  const divStyle = {
    border: `${Math.floor(width / 10)}px solid ${color}`,
    borderColor: `${color} transparent transparent transparent`,
    height: `${Math.floor(height / 1.25)}px`,
    width: `${Math.floor(width / 1.25)}px`,
  }
  return (
    <div className="spinner" aria-label={message} style={spinnerStyle}>
      <div style={divStyle}></div>
      <div style={divStyle}></div>
      <div style={divStyle}></div>
      <div style={divStyle}></div>
    </div>
  )
}

SpinnerComponent.propTypes = {
  color: PropTypes.string,
  height: PropTypes.string,
  message: PropTypes.string,
  width: PropTypes.string
}

SpinnerComponent.defaultProps = {
  color: 'hsl(0, 0%, 70%)',
  height: '24',
  message: 'Please wait...',
  width: '24'
}

export default SpinnerComponent
