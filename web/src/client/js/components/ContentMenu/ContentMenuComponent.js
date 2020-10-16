import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'

import {
  AddIcon,
  DateIcon,
  FileIcon,
  TextIcon,
  StringIcon,
  ImageIcon,
  NumberIcon
} from 'Components/Icons'
import { FIELD_TYPES } from 'Shared/constants'
import { Popper, PopperGroup } from 'Components/Popper/Popper'
import { Menu, MenuItem } from 'Components/Menu'

const ContentMenuComponent = ({ createFieldHandler }) => {
  const [expanded, setExpanded] = useState(false)
  const containerRef = useRef()
  const anchorRef = useRef()

  const collapseCallback = useCallback(() => {
    setExpanded(false)
  }, [])

  const expandCallback = useCallback(() => {
    setExpanded(true)
  }, [])

  useClickOutside(containerRef, collapseCallback)
  useBlur(containerRef, collapseCallback)
  useKeyboardShortcut('+', expandCallback)

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
        <Menu anchorRef={anchorRef} isActive={expanded}>
          <MenuItem>
            <button className="btn btn--blank btn--with-icon" onClick={() => { createFieldHandler(FIELD_TYPES.TEXT) }} ref={React.createRef()}>
              <TextIcon width="26" height="26" /> <span className="label">Text</span>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="btn btn--blank btn--with-icon" onClick={() => { createFieldHandler(FIELD_TYPES.IMAGE) }} ref={React.createRef()}>
              <ImageIcon width="26" height="26" /> <span className="label">Image</span>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="btn btn--blank btn--with-icon" onClick={() => { createFieldHandler(FIELD_TYPES.STRING) }} ref={React.createRef()}>
              <StringIcon width="26" height="26" /> <span className="label">String</span>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="btn btn--blank btn--with-icon" onClick={() => { createFieldHandler(FIELD_TYPES.NUMBER) }} ref={React.createRef()}>
              <NumberIcon width="26" height="26" /> <span className="label">Number</span>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="btn btn--blank btn--with-icon" onClick={() => { createFieldHandler(FIELD_TYPES.DATE) }} ref={React.createRef()}>
              <DateIcon width="26" height="26" /> <span className="label">Date</span>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="btn btn--blank btn--with-icon" onClick={() => { createFieldHandler(FIELD_TYPES.FILE) }} ref={React.createRef()}>
              <FileIcon width="26" height="26" /> <span className="label">File</span>
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
