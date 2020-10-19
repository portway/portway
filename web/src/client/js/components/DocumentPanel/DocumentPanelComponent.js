import React, { useEffect, useRef } from 'react'
// import PropTypes from 'prop-types'
import { Link, useParams } from 'react-router-dom'

import { PATH_PROJECT, PROJECT_ROLE_IDS } from 'Shared/constants'

import ProjectPermission from 'Components/Permission/ProjectPermission'
import DocumentPanelItem from './DocumentPanelItem'
import DocumentInfoContainer from './DocumentInfo/DocumentInfoContainer'
import DocumentOutlineContainer from './DocumentOutline/DocumentOutlineContainer'

import './DocumentPanelStyles.scss'

const DocumentPanelComponent = () => {
  const panelRef = useRef()
  const { projectId } = useParams()

  useEffect(() => {
    const panel = panelRef.current
    if (panel) {
      panel.classList.add('document-panel--active')
    }
    return () => {
      panel.classList.remove('document-panel--active')
    }
  })

  const outlineInfo = <>
    <p>Drag and drop to reorder your document, or remove fields altogether</p>
    <ProjectPermission acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN]}>
      <p className="document-outline__description note">Name your fields for use in <Link to={`${PATH_PROJECT}/${projectId}/settings/keys`}>the API</Link></p>
    </ProjectPermission>
  </>

  return (
    <div className="document-panel" ref={panelRef}>
      <DocumentPanelItem label="Document settings">
        <DocumentInfoContainer />
      </DocumentPanelItem>
      <DocumentPanelItem expanded info={outlineInfo} label="Outline">
        <DocumentOutlineContainer />
      </DocumentPanelItem>
    </div>
  )
}

DocumentPanelComponent.propTypes = {
}

export default DocumentPanelComponent
