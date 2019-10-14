import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import './_Popover.scss'

const PopoverComponent = ({ children, className }) => {
  const popoverClasses = cx({
    'popover': true,
    [className]: className
  })
  return (
    <div className={popoverClasses}>
      <div className="popover__container">
        {children}
      </div>
    </div>
  )
}

PopoverComponent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

export default PopoverComponent
