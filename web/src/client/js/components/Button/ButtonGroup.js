import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import './ButtonGroup.scss'

const ButtonGroup = ({ children, className, small, ...props }) => {
  const rootClasses = cx({
    'button-group': true,
    [className]: className,
  })

  return (
    <div className={rootClasses} role="group" aria-label="Split button" {...props}>
      {children}
    </div>
  )
}

ButtonGroup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  props: PropTypes.object,
  small: PropTypes.bool,
}

export default ButtonGroup
