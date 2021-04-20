import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

import './StatusSpinnerStyles.scss'

const SPINNER_ALIGNMENT_OPTIONS = {
  LEADING: 'leading',
  TRAILING: 'trailing'
}

const StatusSpinnerComponent = ({ align, label }) => {
  const classes = cx({
    'status-spinner': true,
    'status-spinner--leading': align === SPINNER_ALIGNMENT_OPTIONS.LEADING,
    'status-spinner--trailing': align === SPINNER_ALIGNMENT_OPTIONS.TRAILING,
  })
  return (
    <div className={classes}>
      <span className="status-spinner__label">{label}</span>
      <SpinnerComponent />
    </div>
  )
}

StatusSpinnerComponent.propTypes = {
  align: PropTypes.oneOf([SPINNER_ALIGNMENT_OPTIONS.LEADING, SPINNER_ALIGNMENT_OPTIONS.TRAILING]),
  label: PropTypes.string
}

export default StatusSpinnerComponent
