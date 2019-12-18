import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import './_Menu.scss'

const Menu = ({ anchorRef, className, children, isActive, ...props }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [menuItems, setMenuItems] = useState([])

  const keyNavigationHandler = useCallback((e) => {
    let counterBecauseUseState = selectedIndex

    switch (e.key) {
      case 'ArrowDown':
        // Increase the index
        setSelectedIndex(counterBecauseUseState++)
        break
      case 'ArrowUp':
        // Decrease the index
        setSelectedIndex(counterBecauseUseState--)
        break
      default:
        return
    }

    // If we've gone past zero, focus the original element
    if (counterBecauseUseState < 0) {
      setSelectedIndex(-1)
      anchorRef.current.focus()
      return
    }

    // If we're within range, set the correct index and focus that ref
    if (counterBecauseUseState >= 0 && counterBecauseUseState <= menuItems.length - 1) {
      setSelectedIndex(counterBecauseUseState)
      menuItems[counterBecauseUseState].ref.current.focus()
    }
  }, [anchorRef, menuItems, selectedIndex])

  useEffect(() => {
    if (isActive) {
      const menuItemComponents = React.Children.toArray(children).filter((child) => {
        return child.type.name === 'MenuItem'
      })
      const menuItemChildren = menuItemComponents.map((child) => {
        return child.props.children
      })
      const filteredMenuItemChildren = menuItemChildren.filter((child) => {
        return child.ref !== null
      })
      setMenuItems(filteredMenuItemChildren)
      document.addEventListener('keydown', keyNavigationHandler, false)
      return () => {
        document.removeEventListener('keydown', keyNavigationHandler, false)
      }
    } else {
      // Reset once the menu is closed
      setSelectedIndex(-1)
    }
  }, [children, isActive, keyNavigationHandler])

  const menuClasses = cx({
    'menu': true,
    [className]: className
  })

  return (
    <ul
      className={menuClasses}
      role="menu"
      tabIndex="-1" {...props}
    >
      {children}
    </ul>
  )
}

Menu.propTypes = {
  anchorRef: PropTypes.object.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  isActive: PropTypes.bool,
}

Menu.defaultProps = {
  isActive: false,
}

export default Menu


