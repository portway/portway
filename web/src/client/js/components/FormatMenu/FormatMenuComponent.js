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

  const toggleCallback = useCallback(() => {
    anchorRef.current.focus()
  }, [])

  useClickOutside(containerRef, collapseCallback)
  useBlur(containerRef, collapseCallback)
  useKeyboardShortcut('n', toggleCallback)

  return (
    <PopperGroup className="document-menu format-menu" anchorRef={containerRef}>
      <button
        aria-expanded={expanded}
        aria-haspopup="true"
        aria-controls="format-menu"
        aria-label="Add a field"
        className="btn btn--blank btn--with-circular-icon document-menu__button"
        onClick={() => setExpanded(!expanded)}
        ref={anchorRef}
        title="Add a field"
      >
        <FormatIcon width="24" height="24" />
      </button>
      <Popper id="format-menu" anchorRef={anchorRef} open={expanded} placement="bottom" width="200">
        <Menu anchorRef={anchorRef}>
          <MenuItem tabIndex="0">
            <button className="btn btn--blank" onClick={() => formatSelection('h1') }>
              <span className="format-menu__format">#</span> Heading 1
            </button>
          </MenuItem>
          <MenuItem tabIndex="-1">
            <button className="btn btn--blank" onClick={() => formatSelection('h2') }>
              <span className="format-menu__format">##</span> Heading 2
            </button>
          </MenuItem>
          <MenuItem tabIndex="-1">
            <button className="btn btn--blank" onClick={() => formatSelection('h3') }>
              <span className="format-menu__format">###</span> Heading 3
            </button>
          </MenuItem>
          <hr />
          <MenuItem tabIndex="-1">
            <button className="btn btn--blank" onClick={() => formatSelection('bold') }>
              <span className="format-menu__format">**</span> <b>Bold</b><span className="format-menu__closing">**</span>
            </button>
          </MenuItem>
          <MenuItem tabIndex="-1">
            <button className="btn btn--blank" onClick={() => formatSelection('italic') }>
              <span className="format-menu__format">_</span> <i>Italic</i><span className="format-menu__closing">_</span>
            </button>
          </MenuItem>
          <MenuItem tabIndex="-1">
            <button className="btn btn--blank" onClick={() => formatSelection('strikethrough') }>
              <span className="format-menu__format">~~</span> <span className="strikethrough">Strike-through</span><span className="format-menu__closing">~~</span>
            </button>
          </MenuItem>
          <hr />
          <MenuItem tabIndex="-1">
            <button className="btn btn--blank" onClick={() => formatSelection('link') }>
              <span className="format-menu__format">[</span> <span className="format-menu__link">Link</span><span className="format-menu__closing">]</span>
            </button>
          </MenuItem>
          <MenuItem tabIndex="-1">
            <button className="btn btn--blank" onClick={() => formatSelection('hr') }>
              <span className="format-menu__format">---</span> Horizontal Rule
            </button>
          </MenuItem>
          <MenuItem tabIndex="-1">
            <button className="btn btn--blank" onClick={() => formatSelection('ul') }>
              <span className="format-menu__format">*</span> Unordered List
            </button>
          </MenuItem>
          <MenuItem tabIndex="-1">
            <button className="btn btn--blank" onClick={() => formatSelection('ol') }>
              <span className="format-menu__format">1.</span> Ordered List
            </button>
          </MenuItem>
          <MenuItem tabIndex="-1">
            <button className="btn btn--blank" onClick={() => formatSelection('blockquote') }>
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
