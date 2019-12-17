import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import './IconButton.scss'

const IconButton = ({ children, color, ...props }) => {
  const buttonClasses = cx({
    'icon-button': true,
    [`icon-button--${color}`]: color,
  })
  return <button className={buttonClasses} {...props}>{children}</button>
}

IconButton.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
}

export default IconButton
