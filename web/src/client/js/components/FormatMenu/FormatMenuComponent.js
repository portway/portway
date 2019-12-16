import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'

import { FIELD_TYPES } from 'Shared/constants'
import { FormatIcon } from 'Components/Icons'

import { Popper, PopperGroup } from 'Components/Popper/Popper'
import { Menu, MenuItem } from 'Components/Menu'

import './_FormatMenu.scss'

const FormatMenuComponent = ({ focusedField }) => {
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

  function formatSelection(format) {
    if (focusedField.type === FIELD_TYPES.TEXT) {
      const editor = focusedField.data
      // https://github.com/Ionaru/easy-markdown-editor/blob/master/src/js/easymde.js#L2450
      switch (format) {
        case 'h1':
          editor.toggleHeading1(editor)
          break
        case 'h2':
          editor.toggleHeading2(editor)
          break
        case 'h3':
          editor.toggleHeading3(editor)
          break
        case 'bold':
          editor.toggleBold(editor)
          break
        case 'italic':
          editor.toggleItalic(editor)
          break
        case 'strikethrough':
          editor.toggleStrikethrough(editor)
          break
        case 'link':
          editor.drawLink(editor)
          break
        case 'hr':
          editor.drawHorizontalRule(editor)
          break
        case 'ul':
          editor.toggleUnorderedList(editor)
          break
        case 'ol':
          editor.toggleOrderedList(editor)
          break
        case 'blockquote':
          editor.toggleBlockquote(editor)
          break
        case 'code':
          editor.toggleCodeBlock(editor)
          break
        default:
          break
      }
    }
  }

  const button = {
    icon: <FormatIcon width="24" height="24" />,
    label: 'Format tools'
  }

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
              <span className="format-menu__format">*</span> <b>Bold</b><span className="format-menu__closing">*</span>
            </button>
          </MenuItem>
          <MenuItem tabIndex="-1">
            <button className="btn btn--blank" onClick={() => formatSelection('italic') }>
              <span className="format-menu__format">/</span> <i>Italic</i><span className="format-menu__closing">/</span>
            </button>
          </MenuItem>
          <MenuItem tabIndex="-1">
            <button className="btn btn--blank" onClick={() => formatSelection('strikethrough') }>
              <span className="format-menu__format">~</span> <span className="strikethrough">Strike-through</span><span className="format-menu__closing">~</span>
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
          <MenuItem tabIndex="-1">
            <button className="btn btn--blank" onClick={() => formatSelection('code') }>
              <span className="format-menu__format">`</span> Code
            </button>
          </MenuItem>
        </Menu>
      </Popper>
    </PopperGroup>
  )
}

FormatMenuComponent.propTypes = {
  focusedField: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.number,
    data: PropTypes.object,
  })
}

export default FormatMenuComponent
