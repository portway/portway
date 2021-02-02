import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DOCUMENT_MODE } from 'Shared/constants'

import DocumentPanelComponent from './DocumentPanelComponent'

const DocumentPanelContainer = ({ documentMode }) => {
  if (documentMode === DOCUMENT_MODE.EDIT) {
    return <DocumentPanelComponent/>
  }

  return null
}

DocumentPanelContainer.propTypes = {
  documentMode: PropTypes.string.required
}

const mapStateToProps = (state) => {
  return {
    documentMode: state.ui.document.documentMode,
  }
}

export default connect(mapStateToProps)(DocumentPanelContainer)
