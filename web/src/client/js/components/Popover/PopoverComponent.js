import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import './_Popover.scss'

const PopoverComponent = ({ children, className, name }) => {
  const popoverClasses = cx({
    'popover': true,
    [className]: className
  })
  return (
    <div id={name} className={popoverClasses} role="tooltip">
      <div className="popover__container">
        {children}
      </div>
    </div>
  )
}

PopoverComponent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
}

export default PopoverComponent
