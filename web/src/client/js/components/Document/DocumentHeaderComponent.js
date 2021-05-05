import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useParams } from 'react-router-dom'
import cx from 'classnames'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import {
  MOBILE_MATCH_SIZE,
  MULTI_USER_PLAN_TYPES,
  ORG_SUBSCRIPTION_STATUS,
  PATH_PROJECT,
  PROJECT_ACCESS_LEVELS,
  PROJECT_ROLE_IDS
} from 'Shared/constants'
import { debounce } from 'Shared/utilities'
import { ArrowIcon, ExpandIcon, PanelIcon } from 'Components/Icons'
import ProjectPermission from 'Components/Permission/ProjectPermission'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'
import DocumentUsersContainer from 'Components/DocumentUsers/DocumentUsersContainer'

import './_Document.scss'
import { IconButton } from 'Components/Buttons/index'

const DocumentHeaderComponent = ({
  document,
  isFullScreen,
  isDocumentPanelOpen,
  nameChangeHandler,
  toggleDocumentPanel,
  toggleFullScreenHandler,
}) => {
  const { projectId } = useParams()
  const documentRef = useRef()
  const titleRef = useRef()
  const [documentName, setDocumentName] = useState(document.name)
  const { data: project } = useDataService(dataMapper.projects.id(projectId), [projectId])
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

  useEffect(() => {
    // only set the document name from incoming data if the user isn't currenly focused on that element
    if (window.document.activeElement !== titleRef.current) {
      setDocumentName(document.name)
    }
  }, [document.name])

  if (!document.id) return null

  const projectAssignment = userProjectAssignments[Number(projectId)]
  const readOnlyRoleIds = [PROJECT_ROLE_IDS.READER]
  const mobileView = window.matchMedia(MOBILE_MATCH_SIZE).matches
  const supportsFullScreen = documentRef.current && (documentRef.current.requestFullscreen || documentRef.current.webkitRequestFullscreen)
  const isLikelyAniPad = 'ontouchstart' in window && navigator.platform === 'MacIntel'

  let documentReadOnlyMode
  // False because null / true == loading
  if (assignmentLoading === false) {
    // If a user is a READER role, but the project is publicly WRITABLE, they can edit the document
    // If a user is a WRITER role, assigned to the project, and the project is publicly READABLE, they can edit the document
    // If a user is not assigned the project, but the project is publicly WRITABLE, they can edit the project
    documentReadOnlyMode = projectAssignment == null && project.accessLevel === PROJECT_ACCESS_LEVELS.READ ||
                           (projectAssignment && readOnlyRoleIds.includes(projectAssignment.roleId))
  }

  const documentUsersClasses = cx({
    'document__users-list': true,
    'document__users-list--without-settings': documentReadOnlyMode
  })

  const panelButtonColor = isDocumentPanelOpen ? '' : 'transparent'
  const panelIconFill = isDocumentPanelOpen ? 'var(--color-blue)' : 'var(--theme-icon-color)'

  const changeHandlerAction = debounce(500, (e) => {
    nameChangeHandler(e)
  })

  return (
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
          value={documentName}
          onChange={(e) => {
            e.persist()
            setDocumentName(e.target.value)
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
      <OrgPlanPermission acceptedPlans={MULTI_USER_PLAN_TYPES} acceptedSubscriptionStatuses={[ORG_SUBSCRIPTION_STATUS.ACTIVE]}>
        <div className={documentUsersClasses}>
          <DocumentUsersContainer />
        </div>
      </OrgPlanPermission>
      <ProjectPermission acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN, PROJECT_ROLE_IDS.CONTRIBUTOR]}>
        <div className="document__toggle-container">
          {isDocumentPanelOpen &&
          <span className="note">Close the document panel</span>
          }
          <IconButton color={panelButtonColor} onClick={toggleDocumentPanel} title="Toggle the document panel">
            <PanelIcon fill={panelIconFill} />
          </IconButton>
        </div>
      </ProjectPermission>
    </header>
  )
}

// @todo fill out this document object and add defaults
DocumentHeaderComponent.propTypes = {
  document: PropTypes.object,
  isDocumentPanelOpen: PropTypes.bool.isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  nameChangeHandler: PropTypes.func.isRequired,
  toggleDocumentPanel: PropTypes.func.isRequired,
  toggleFullScreenHandler: PropTypes.func.isRequired,
}

DocumentHeaderComponent.defaultProps = {
  document: {
    name: ''
  },
}

export default DocumentHeaderComponent
