import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { FIELD_TYPES } from 'Shared/constants'
import {
  drawLink,
  drawHorizontalRule,
  toggleStrikeThrough,
  toggleBold,
  toggleHeading1,
  toggleHeading2,
  toggleHeading3,
  toggleItalic,
  toggleBlockquote,
  toggleUnorderedList,
  toggleOrderedList
} from './FormatMenuLibs'
import FormatMenuComponent from './FormatMenuComponent'

const FormatMenuContainer = ({ focusedField }) => {
  function formatSelection(format) {
    if (focusedField.type === FIELD_TYPES.TEXT) {
      const editor = focusedField.data
      switch (format) {
        case 'h1':
          toggleHeading1(editor)
          break
        case 'h2':
          toggleHeading2(editor)
          break
        case 'h3':
          toggleHeading3(editor)
          break
        case 'bold':
          toggleBold(editor)
          break
        case 'italic':
          toggleItalic(editor)
          break
        case 'strikethrough':
          toggleStrikeThrough(editor)
          break
        case 'link':
          drawLink(editor)
          break
        case 'hr':
          drawHorizontalRule(editor)
          break
        case 'ul':
          toggleUnorderedList(editor)
          break
        case 'ol':
          toggleOrderedList(editor)
          break
        case 'blockquote':
          toggleBlockquote(editor)
          break
        default:
          break
      }
    }
  }

  return <FormatMenuComponent formatSelection={formatSelection} />
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
