import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { FIELD_TYPES } from 'Shared/constants'
import {
  blockStyles,
  drawLink,
  drawHorizontalRule,
  toggleBlock,
  toggleHeading,
  toggleLine
} from './FormatMenuLibs'
import FormatMenuComponent from './FormatMenuComponent'

const FormatMenuContainer = ({ focusedField }) => {
  function formatSelection(format) {
    if (focusedField.type === FIELD_TYPES.TEXT) {
      const editor = focusedField.data
      switch (format) {
        case 'h1':
          toggleHeading(editor, 1)
          break
        case 'h2':
          toggleHeading(editor, 2)
          break
        case 'h3':
          toggleHeading(editor, 3)
          break
        case 'bold':
          toggleBlock(editor, 'bold', blockStyles.bold)
          break
        case 'italic':
          toggleBlock(editor, 'italic', blockStyles.italic)
          break
        case 'strikethrough':
          toggleBlock(editor, 'strikethrough', '~~')
          break
        case 'link':
          drawLink(editor)
          break
        case 'hr':
          drawHorizontalRule(editor)
          break
        case 'ul':
          toggleLine(editor, 'ordered-list')
          break
        case 'ol':
          toggleLine(editor, 'unordered-list')
          break
        case 'blockquote':
          toggleLine(editor, 'quote')
          break
        default:
          break
      }
    }
  }

  return <FormatMenuComponent formatSelection={formatSelection} focusedField={focusedField} />
}

FormatMenuContainer.propTypes = {
  focusedField: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.number,
    data: PropTypes.object,
  })
}

const mapStateToProps = (state) => {
  return {
    focusedField: state.documentFields.focused
  }
}

export default connect(mapStateToProps)(FormatMenuContainer)
