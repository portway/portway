import React from 'react'
import PropTypes from 'prop-types'

import { FIELD_TYPES } from 'Shared/constants'
import { FormatIcon } from 'Components/Icons'
import DocumentMenuComponent from 'Components/DocumentMenu/DocumentMenuComponent'
import DocumentMenuGroup from 'Components/DocumentMenu/DocumentMenuGroup'

import './_FormatMenu.scss'

const FormatMenuComponent = ({ focusedField }) => {
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
    <DocumentMenuComponent button={button}>
      <DocumentMenuGroup>
        <button className="btn btn--blank" role="menuitem" onClick={() => formatSelection('h1') }>
          <span className="format-menu__format">#</span> Heading 1
        </button>
        <button className="btn btn--blank" role="menuitem" onClick={() => formatSelection('h2') }>
          <span className="format-menu__format">##</span> Heading 2
        </button>
        <button className="btn btn--blank" role="menuitem" onClick={() => formatSelection('h3') }>
          <span className="format-menu__format">###</span> Heading 3
        </button>
      </DocumentMenuGroup>
      <DocumentMenuGroup>
        <button className="btn btn--blank" role="menuitem" onClick={() => formatSelection('bold') }>
          <span className="format-menu__format">*</span> <b>Bold</b><span className="format-menu__closing">*</span>
        </button>
        <button className="btn btn--blank" onClick={() => formatSelection('italic') }>
          <span className="format-menu__format">/</span> <i>Italic</i><span className="format-menu__closing">/</span>
        </button>
        <button className="btn btn--blank" onClick={() => formatSelection('strikethrough') }>
          <span className="format-menu__format">~</span> <span className="strikethrough">Strike-through</span><span className="format-menu__closing">~</span>
        </button>
        <button className="btn btn--blank" onClick={() => formatSelection('link') }>
          <span className="format-menu__format">[</span> <span className="format-menu__link">Link</span><span className="format-menu__closing">]</span>
        </button>
      </DocumentMenuGroup>
      <DocumentMenuGroup>
        <button className="btn btn--blank" role="menuitem" onClick={() => formatSelection('hr') }>
          <span className="format-menu__format">---</span> Horizontal Rule
        </button>
        <button className="btn btn--blank" role="menuitem" onClick={() => formatSelection('ul') }>
          <span className="format-menu__format">*</span> Unordered List
        </button>
        <button className="btn btn--blank" role="menuitem" onClick={() => formatSelection('ol') }>
          <span className="format-menu__format">1.</span> Ordered List
        </button>
        <button className="btn btn--blank" role="menuitem" onClick={() => formatSelection('blockquote') }>
          <span className="format-menu__format">&gt;</span> Blockquote
        </button>
        <button className="btn btn--blank" role="menuitem" onClick={() => formatSelection('code') }>
          <span className="format-menu__format">`</span> Code
        </button>
      </DocumentMenuGroup>
    </DocumentMenuComponent>
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
