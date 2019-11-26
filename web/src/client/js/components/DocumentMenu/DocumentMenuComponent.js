import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import useClickOutside from 'Hooks/useClickOutside'

import './_DocumentMenu.scss'

const DocumentMenuComponent = ({ button, children, className }) => {
  const [expanded, setExpanded] = useState(false)
  const menuRef = useRef()
  const contentRef = useRef()
  const collapseCallback = useCallback(() => {
    contentRef.current.scrollTop = 0
    setExpanded(false)
  }, [])
  useClickOutside(menuRef, collapseCallback)

  const dmClasses = cx({
    'document-menu': true,
    [className]: className
  })

  return (
    <div className={dmClasses} ref={menuRef}>
      <button
        className="btn btn--blank btn--with-circular-icon document-menu__button"
        aria-haspopup
        aria-expanded={expanded}
        aria-label={button.label}
        onClick={() => { setExpanded(!expanded) }}
        title={button.label}>
        {button.icon}
      </button>
      <div className="document-menu__content" hidden={!expanded} ref={contentRef}>
        {children}
      </div>
    </div>
  )
}

DocumentMenuComponent.propTypes = {
  button: PropTypes.shape({
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
  }),
  children: PropTypes.node,
  className: PropTypes.string,
}

export default DocumentMenuComponent
