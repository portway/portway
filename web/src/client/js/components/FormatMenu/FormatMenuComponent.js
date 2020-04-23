import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'

import { FormatIcon } from 'Components/Icons'

import { Popper, PopperGroup } from 'Components/Popper/Popper'
import { Menu, MenuItem } from 'Components/Menu'

import './_FormatMenu.scss'

const FormatMenuComponent = ({ formatSelection }) => {
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
  useKeyboardShortcut('b', expandCallback)

  return (
    <PopperGroup className="document-menu format-menu" anchorRef={containerRef}>
      <button
        aria-expanded={expanded}
        aria-haspopup="true"
        aria-controls="format-menu"
        aria-label="Format text"
        className="btn btn--blank btn--with-circular-icon document-menu__button"
        onClick={() => setExpanded(!expanded)}
        ref={anchorRef}
        title="Format text"
      >
        <FormatIcon width="24" height="24" />
      </button>
      <Popper
        anchorRef={anchorRef}
        autoCollapse={collapseCallback}
        id="format-menu"
        open={expanded}
        placement="bottom"
        width="200"
      >
        <Menu anchorRef={anchorRef} isActive={expanded}>
          <MenuItem>
            <button className="btn btn--blank" onClick={() => formatSelection('h1') } ref={React.createRef()}>
              <span className="format-menu__format">#</span> Heading 1
            </button>
          </MenuItem>
          <MenuItem>
            <button className="btn btn--blank" onClick={() => formatSelection('h2') } ref={React.createRef()}>
              <span className="format-menu__format">##</span> Heading 2
            </button>
          </MenuItem>
          <MenuItem>
            <button className="btn btn--blank" onClick={() => formatSelection('h3') } ref={React.createRef()}>
              <span className="format-menu__format">###</span> Heading 3
            </button>
          </MenuItem>
          <hr />
          <MenuItem>
            <button className="btn btn--blank" onClick={() => formatSelection('bold') } ref={React.createRef()}>
              <span className="format-menu__format">**</span> <b>Bold</b><span className="format-menu__closing">**</span>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="btn btn--blank" onClick={() => formatSelection('italic') } ref={React.createRef()}>
              <span className="format-menu__format">_</span> <i>Italic</i><span className="format-menu__closing">_</span>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="btn btn--blank" onClick={() => formatSelection('strikethrough') } ref={React.createRef()}>
              <span className="format-menu__format">~~</span> <span className="strikethrough">Strike-through</span><span className="format-menu__closing">~~</span>
            </button>
          </MenuItem>
          <hr />
          <MenuItem>
            <button className="btn btn--blank" onClick={() => formatSelection('link') } ref={React.createRef()}>
              <span className="format-menu__format">[</span> <span className="format-menu__link">Link</span><span className="format-menu__closing">]</span>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="btn btn--blank" onClick={() => formatSelection('hr') } ref={React.createRef()}>
              <span className="format-menu__format">---</span> Horizontal rule
            </button>
          </MenuItem>
          <MenuItem>
            <button className="btn btn--blank" onClick={() => formatSelection('ul') } ref={React.createRef()}>
              <span className="format-menu__format">*</span> Unordered list
            </button>
          </MenuItem>
          <MenuItem>
            <button className="btn btn--blank" onClick={() => formatSelection('ol') } ref={React.createRef()}>
              <span className="format-menu__format">1.</span> Ordered list
            </button>
          </MenuItem>
          <MenuItem>
            <button className="btn btn--blank" onClick={() => formatSelection('blockquote') } ref={React.createRef()}>
              <span className="format-menu__format">&gt;</span> Blockquote
            </button>
          </MenuItem>
        </Menu>
      </Popper>
    </PopperGroup>
  )
}

FormatMenuComponent.propTypes = {
  formatSelection: PropTypes.func.isRequired,
  focusedField: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.number,
    data: PropTypes.object,
  })
}

export default FormatMenuComponent
