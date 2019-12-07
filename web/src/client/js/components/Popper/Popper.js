import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import './_Popper.scss'

// @todo replace all Popover's and Dropdown's with this eventually
/**
 * Popper
 * A popover replacement that can render any child
 * @param anchorRef a related ref to help calculate position
 * @param children whatever children to render
 * @param open boolean of whatever to be visible or not
 * @param placement top / right / bottom / left position from anchorRef
 * @param role optional aria role
 */
export const Popper = ({ align, anchorRef, autoCollapse, children, open, placement, role, width, ...props }) => {
  const popperRef = useRef()

  // Get the size and position of the anchor element
  const anchorRect = anchorRef && anchorRef.current ?
    anchorRef.current.getBoundingClientRect() : 0

  const spacing = {
    'top': 32,
    'right': 12,
    'bottom': 64,
    'left': 12
  }

  const popperClasses = cx({
    'popper': true,
    'popper--align-left': align === 'left',
    'popper--align-center': align === 'center',
    'popper--align-right': align === 'right',
    'popper--placement-top': placement === 'top',
    'popper--placement-right': placement === 'right',
    'popper--placement-bottom': placement === 'bottom',
    'popper--placement-left': placement === 'left',
  })
  const style = {
    bottom: placement === 'bottom' ? spacing[placement] : 'unset',
    minWidth: anchorRect.width + 'px',
    top: placement === 'top' ? spacing[placement] : 'unset',
    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
    width: width ? width + 'px' : 'auto',
  }

  return (
    <div
      ariarole={role}
      className={popperClasses}
      hidden={open}
      onClick={() => { if (autoCollapse) { autoCollapse() } }}
      onKeyDown={(e) => {
        if (e.keyCode === 13) {
          autoCollapse()
        }
      }}
      ref={popperRef}
      role="listbox"
      style={style}
      tabIndex="-1"
      {...props}
    >
      {children}
    </div>
  )
}

Popper.propTypes = {
  align: PropTypes.oneOf(['left', 'center', 'right']),
  anchorRef: PropTypes.object.isRequired,
  autoCollapse: PropTypes.func,
  children: PropTypes.node,
  open: PropTypes.bool.isRequired,
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  role: PropTypes.string,
  width: PropTypes.string,
}

Popper.defaultProps = {
  align: 'left',
  open: false,
  placement: 'top',
}

/**
 * PopperGroup
 * Useful when you need a trigger for a Popper such as a button or link
 * @param children node
 */
export const PopperGroup = ({ children, className, anchorRef }) => {
  const popperGroupClasses = cx({
    'popper-group': true,
    [className]: className
  })
  return (
    <div className={popperGroupClasses} ref={anchorRef}>
      {children}
    </div>
  )
}

PopperGroup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  anchorRef: PropTypes.object,
}
