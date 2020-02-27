import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Link, useParams } from 'react-router-dom'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import {
  DOCUMENT_MODE,
  MOBILE_MATCH_SIZE,
  MULTI_USER_PLAN_TYPES,
  PATH_PROJECT,
  PROJECT_ROLE_IDS
} from 'Shared/constants'
import { debounce } from 'Shared/utilities'
import { ArrowIcon, ExpandIcon, SettingsIcon } from 'Components/Icons'
import ProjectPermission from 'Components/Permission/ProjectPermission'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'
import ValidationContainer from 'Components/Validation/ValidationContainer'
import DocumentFieldsContainer from 'Components/DocumentFields/DocumentFieldsContainer'
import DocumentOutlineContainer from 'Components/DocumentOutline/DocumentOutlineContainer'
import DocumentUsersContainer from 'Components/DocumentUsers/DocumentUsersContainer'

import './_Document.scss'
import { IconButton } from 'Components/Buttons/index'

const DocumentComponent = ({
  document,
  documentMode,
  isFullScreen,
  nameChangeHandler,
  toggleDocumentMode,
  toggleFullScreenHandler,
}) => {
  const { projectId } = useParams()
  const documentRef = useRef()
  const titleRef = useRef()
  const { data: userProjectAssignments = {}, loading: assignmentLoading } = useDataService(dataMapper.users.currentUserProjectAssignments())

  // If we've exited fullscreen, but the UI is still in fullscreen
  // This happens when hitting the escape key when in fullscreen
  useEffect(() => {
    function fullScreenChangeHandler(e) {
      const fullscreenElement = window.document.fullscreenElement || window.document.webkitCurrentFullScreenElement
      if (!fullscreenElement && isFullScreen) toggleFullScreenHandler()
      return
    }
    window.document.addEventListener('fullscreenchange', fullScreenChangeHandler, false)
    window.document.addEventListener('webkitfullscreenchange', fullScreenChangeHandler, false)
    return function cleanup() {
      window.document.removeEventListener('fullscreenchange', fullScreenChangeHandler, false)
      window.document.removeEventListener('webkitfullscreenchange', fullScreenChangeHandler, false)
    }
  })

  const docKey = document ? document.id : 0
  const projectAssignment = userProjectAssignments[Number(projectId)]
  const readOnlyRoleIds = [PROJECT_ROLE_IDS.READER]
  const mobileView = window.matchMedia(MOBILE_MATCH_SIZE).matches
  const supportsFullScreen = documentRef.current && (documentRef.current.requestFullscreen || documentRef.current.webkitRequestFullscreen)
  const isLikelyAniPad = 'ontouchstart' in window && navigator.platform === 'MacIntel'

  let documentReadOnlyMode
  // False because null / true == loading
  if (assignmentLoading === false) {
    documentReadOnlyMode = projectAssignment == null || readOnlyRoleIds.includes(projectAssignment.roleId)
  }

  const changeHandlerAction = debounce(500, (e) => {
    nameChangeHandler(e)
  })

  return (
    <div className="document" key={docKey} ref={documentRef}>
      <ValidationContainer resource="document" value="name" />
      {documentMode === DOCUMENT_MODE.EDIT &&
      <DocumentOutlineContainer />
      }
      <header className="document__header">
        {mobileView &&
        <Link className="btn btn--blank btn--with-circular-icon document__button-expand" to={`${PATH_PROJECT}/${document.projectId}`} aria-label="Back to document list">
          <ArrowIcon direction="left" width="12" height="12" />
        </Link>
        }
        {!mobileView && !isLikelyAniPad && supportsFullScreen &&
        <button
          aria-label="Expand the editor to full screen"
          className="btn btn--blank btn--with-circular-icon document__button-expand"
          onClick={() => {
            // This has to be here because of Safari
            // You have to call fullscreen functions on the actual element onClick
            if (window.document.fullscreenElement || window.document.webkitFullscreenElement) {
              const exitFullscreen = window.document.exitFullscreen || window.document.webkitExitFullscreen
              exitFullscreen.call(window.document)
            } else {
              const documentEl = window.document.documentElement
              const requestFullscreen = documentEl.webkitRequestFullscreen || documentEl.requestFullscreen
              requestFullscreen.call(documentEl)
            }
            toggleFullScreenHandler()
          }}
          title="Expand to full screen">
          <ExpandIcon />
        </button>
        }
        <div className="document__title-container">
          <input
            className="document__title"
            defaultValue={document.name}
            onChange={(e) => {
              e.persist()
              changeHandlerAction(e)
            }}
            onKeyDown={(e) => {
              if (e.key.toLowerCase() === 'enter') {
                nameChangeHandler(e)
                titleRef.current.blur()
              }
            }}
            readOnly={documentReadOnlyMode}
            ref={titleRef} />
        </div>
        <OrgPlanPermission acceptedPlans={MULTI_USER_PLAN_TYPES}>
          <DocumentUsersContainer />
        </OrgPlanPermission>
        <ProjectPermission acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN, PROJECT_ROLE_IDS.CONTRIBUTOR]}>
          <div className="document__toggle-container">
            {documentMode === DOCUMENT_MODE.NORMAL &&
            <IconButton color="transparent" onClick={toggleDocumentMode} title="Re-order or remove fields">
              <SettingsIcon />
            </IconButton>
            }
            {documentMode === DOCUMENT_MODE.EDIT &&
            <button
              className="btn btn--small"
              onClick={toggleDocumentMode}
              name="documentSettings"
              title="Exit outline mode">
              Done
            </button>
            }
          </div>
        </ProjectPermission>
      </header>
      <DocumentFieldsContainer />
    </div>
  )
}

// @todo fill out this document object and add defaults
DocumentComponent.propTypes = {
  document: PropTypes.object,
  documentMode: PropTypes.string,
  isFullScreen: PropTypes.bool.isRequired,
  nameChangeHandler: PropTypes.func.isRequired,
  toggleDocumentMode: PropTypes.func.isRequired,
  toggleFullScreenHandler: PropTypes.func.isRequired,
}

DocumentComponent.defaultProps = {
  document: {
    name: ''
  },
}

export default DocumentComponent
