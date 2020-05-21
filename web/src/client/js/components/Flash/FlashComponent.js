import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { IconButton } from 'Components/Buttons'
import { RemoveIcon } from 'Components/Icons'

import './FlashStyles.scss'

const FlashComponent = ({
  buttonLabel,
  children,
  className,
  dismissable,
  onDismiss,
  onClick,
  size,
  type,
  withButton
}) => {
  const flashClasses = cx({
    'flash': true,
    [`flash--${type}`]: type,
    'flash--fluid': size === 'fluid',
    [className]: className,
  })

  const buttonClasses = cx({
    'btn': true,
    'btn--small': true,
    'btn--white': true,
  })

  const dismissFill = cx({
    'var(--theme-icon-color)': !type,
    'hsl(51, 97%, 30%)': type === 'warning',
    'hsl(353, 72%, 30%)': type === 'error',
    'hsl(125, 45%, 30%)': type === 'success',
  })

  return (
    <div className={flashClasses} role="alert">
      <div className="flash-message">
        {children}
      </div>
      {withButton &&
      <button className={buttonClasses} onClick={onClick}>
        {buttonLabel}
      </button>
      }
      {dismissable &&
      <IconButton color="transparent" onClick={onDismiss}>
        <RemoveIcon fill={dismissFill} width="12" height="12" />
      </IconButton>
      }
    </div>
  )
}

FlashComponent.propTypes = {
  buttonLabel: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  dismissable: PropTypes.bool,
  onClick: PropTypes.func,
  onDismiss: PropTypes.func,
  size: PropTypes.oneOf(['default', 'full']),
  type: PropTypes.oneOf(['error', 'success', 'warning']),
  withButton: PropTypes.bool,
}

FlashComponent.defaultProps = {
  dismissable: false,
  size: 'default',
}

export default FlashComponent
