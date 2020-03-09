import React from 'react'
import PropTypes from 'prop-types'

const ToggleButton = ({ options }) => {
  return options.map((option, index) => {
    return <button key={`tb-${index}`}>{option.name}</button>
  })
}

ToggleButton.propTypes = {
  options: PropTypes.array.isRequired,
}

export default ToggleButton
