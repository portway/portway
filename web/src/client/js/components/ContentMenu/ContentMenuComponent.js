import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'

import { AddIcon, DateIcon, TextIcon, StringIcon, ImageIcon, NumberIcon } from 'Components/Icons'
import { FIELD_TYPES } from 'Shared/constants'
import { Popper, PopperGroup } from 'Components/Popper/Popper'
import { Menu, MenuHeader, MenuItem } from 'Components/Menu'

const ContentMenuComponent = ({ createFieldHandler }) => {
  const [expanded, setExpanded] = useState(false)
  const containerRef = useRef()
  const anchorRef = useRef()

  const collapseCallback = useCallback(() => {
    setExpanded(false)
  }, [])

  const toggleCallback = useCallback(() => {
    anchorRef.current.focus()
  }, [])

  useClickOutside(containerRef, collapseCallback)
  useBlur(containerRef, collapseCallback)
  useKeyboardShortcut('+', toggleCallback)

  return (
    <PopperGroup className="document-menu" anchorRef={containerRef}>
      <button
        aria-expanded={expanded}
        aria-haspopup="true"
        aria-controls="content-menu"
        aria-label="Add a field"
        className="btn btn--blank btn--with-circular-icon document-menu__button"
        onClick={() => setExpanded(!expanded)}
        ref={anchorRef}
        title="Add a field"
      >
        <AddIcon width="24" height="24" />
      </button>
      <Popper
        id="content-menu"
        anchorRef={anchorRef}
        autoCollapse={collapseCallback}
        open={expanded}
        placement="bottom"
        width="130"
      >
        <MenuHeader><h2>Content</h2></MenuHeader>
        <Menu anchorRef={anchorRef}>
          <MenuItem tabIndex="0">
            <button className="btn btn--blank btn--with-icon" onClick={() => { createFieldHandler(FIELD_TYPES.TEXT) }}>
              <TextIcon width="26" height="26" /> <span className="label">Body</span>
            </button>
          </MenuItem>
          <MenuItem tabIndex="-1">
            <button className="btn btn--blank btn--with-icon" onClick={() => { createFieldHandler(FIELD_TYPES.IMAGE) }}>
              <ImageIcon width="26" height="26" /> <span className="label">Image</span>
            </button>
          </MenuItem>
          <MenuItem tabIndex="-1">
            <button className="btn btn--blank btn--with-icon" onClick={() => { createFieldHandler(FIELD_TYPES.FILE) }}>
              <ImageIcon width="26" height="26" /> <span className="label">File</span>
            </button>
          </MenuItem>
        </Menu>
        <MenuHeader><h2>Data</h2></MenuHeader>
        <Menu anchorRef={anchorRef}>
          <MenuItem>
            <button className="btn btn--blank btn--with-icon" onClick={() => { createFieldHandler(FIELD_TYPES.STRING) }}>
              <StringIcon width="26" height="26" /> <span className="label">String</span>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="btn btn--blank btn--with-icon" onClick={() => { createFieldHandler(FIELD_TYPES.NUMBER) }}>
              <NumberIcon width="26" height="26" /> <span className="label">Number</span>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="btn btn--blank btn--with-icon" onClick={() => { createFieldHandler(FIELD_TYPES.DATE) }}>
              <DateIcon width="26" height="26" /> <span className="label">Date</span>
            </button>
          </MenuItem>
        </Menu>
      </Popper>
    </PopperGroup>
  )
}

ContentMenuComponent.propTypes = {
  createFieldHandler: PropTypes.func.isRequired,
}

export default ContentMenuComponent
