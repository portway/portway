import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import DocumentPanelComponent from './DocumentPanelComponent'

const DocumentPanelContainer = ({ isDocumentPanelOpen }) => {
  if (isDocumentPanelOpen) {
    return <DocumentPanelComponent/>
  }

  return null
}

DocumentPanelContainer.propTypes = {
  isDocumentPanelOpen: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => {
  return {
    isDocumentPanelOpen: state.documentPanel.panel.visible,
  }
}

export default connect(mapStateToProps)(DocumentPanelContainer)
