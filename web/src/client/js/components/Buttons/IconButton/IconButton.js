import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import './IconButton.scss'

const IconButton = ({ children, className, color, square, ...props }) => {
  const buttonClasses = cx({
    'icon-button': true,
    'icon-button--square': square,
    [`icon-button--${color}`]: color,
    [className]: className,
  })
  return <button className={buttonClasses} {...props}>{children}</button>
}

IconButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  square: PropTypes.bool,
}

export default IconButton
