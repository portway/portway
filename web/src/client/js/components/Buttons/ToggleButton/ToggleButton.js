import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import cuid from 'cuid'

import './_ToggleButton.scss'

const ToggleButton = ({ checked, label, onClick, options }) => {
  const uid = useRef(cuid.slug())
  return (
    <div className="toggle-button">
      <span className="toggle-button__label" id={`tb-${uid.current}`}>{label}</span>
      <button
        aria-checked={checked}
        aria-labelledby={`tb-${uid.current}`}
        className="btn btn--blank toggle-button__button"
        onClick={() => {
          onClick(!checked)
        }}
        role="switch"
      >
        {options.map((option, index) => {
          return <span className="toggle-button__value" key={`tb-${index}`}>{option}</span>
        })}
      </button>
    </div>
  )
}

ToggleButton.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
}

export default ToggleButton
