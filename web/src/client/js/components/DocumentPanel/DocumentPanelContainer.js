import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectDocumentPanelTab } from 'Actions/documentPanel'
import DocumentPanelComponent from './DocumentPanelComponent'

const DocumentPanelContainer = ({ isDocumentPanelOpen, selectDocumentPanelTab, selectedTabIndex }) => {
  function selectTabHandler(tabIndex) {
    selectDocumentPanelTab(tabIndex)
  }

  if (isDocumentPanelOpen) {
    return (
      <DocumentPanelComponent
        selectTabHandler={selectTabHandler}
        selectedTabIndex={selectedTabIndex}
      />
    )
  }

  return null
}

DocumentPanelContainer.propTypes = {
  isDocumentPanelOpen: PropTypes.bool.isRequired,
  selectDocumentPanelTab: PropTypes.func.isRequired,
  selectedTabIndex: PropTypes.number,
}

const mapDispatchToProps = {
  selectDocumentPanelTab
}

const mapStateToProps = (state) => {
  return {
    isDocumentPanelOpen: state.documentPanel.panel.visible,
    selectedTabIndex: state.documentPanel.panel.selectedTabIndex,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPanelContainer)
