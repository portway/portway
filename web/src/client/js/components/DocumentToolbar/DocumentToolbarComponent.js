import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { DELETE_DOCUMENT_BUTTON_LABEL, UNPUBLISH_BUTTON_LABEL } from 'Loc/strings'
import { DOCUMENT_MODE, PROJECT_ROLE_IDS } from 'Shared/constants'
import { PublishIcon } from 'Components/Icons'

import ProjectPermission from 'Components/Permission/ProjectPermission'
import ContentMenuContainer from 'Components/ContentMenu/ContentMenuContainer'
import FormatMenuContainer from 'Components/FormatMenu/FormatMenuContainer'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

import './_DocumentToolbar.scss'

const DocumentToolbarComponent = ({
  document,
  documentMode,
  isCreating,
  isPublishing,
  projectUsers,
  publishDocumentHandler,
  removeDocumentHandler,
  unpublishDocumentHandler,
}) => {
  const publishDisabled = moment(document.updatedAt).isSameOrBefore(document.lastPublishedAt, 'second')
  const publishString = document.lastPublishedAt === null ? 'to API' : 'changes'

  function publishButtonTitle() {
    if (document && document.publishedVersionId && document.lastPublishedAt) {
      return `Published ${moment(document.lastPublishedAt).fromNow()}`
    } else {
      return 'Publish document'
    }
  }

  return (
    <ProjectPermission acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN, PROJECT_ROLE_IDS.CONTRIBUTOR]}>
      <footer className="document-toolbar">
        <div className="document-toolbar__start">
          {documentMode === DOCUMENT_MODE.NORMAL &&
          <>
          <FormatMenuContainer />
          <ContentMenuContainer />
          </>
          }
        </div>
        <div className="document-toolbar__end">

          {document &&
          <div className="document-toolbar__info">
            {documentMode === DOCUMENT_MODE.NORMAL &&
            <>
            Last update:&nbsp;
            <span title={moment(document.updatedAt).format('MMMM do, YYYY - h:mma')}>
              {moment(document.updatedAt).fromNow()}
            </span>
            </>
            }

            {documentMode === DOCUMENT_MODE.EDIT && document.lastPublishedAt !== null &&
            <>
            Last published:&nbsp;
            <span title={moment(document.lastPublishedAt).format('MMMM do, YYYY - h:mma')}>
              {moment(document.lastPublishedAt).fromNow()}
            </span>
            </>
            }
          </div>
          }

          {documentMode === DOCUMENT_MODE.EDIT &&
          <>
          <button
            className="btn btn--small btn--white"
            disabled={document.lastPublishedAt === null}
            onClick={unpublishDocumentHandler}
          >
            {isPublishing && <SpinnerComponent width="12" height="12" color="#ffffff" />}
            <span className="label">{UNPUBLISH_BUTTON_LABEL}</span>
          </button>
          <button className="btn btn--small btn--white btn--danger" onClick={removeDocumentHandler}>
            <span className="label">{DELETE_DOCUMENT_BUTTON_LABEL}</span>
          </button>
          </>
          }

          {documentMode === DOCUMENT_MODE.NORMAL &&
          <button
            className="btn btn--small btn--with-icon"
            disabled={isPublishing || isCreating || publishDisabled}
            onClick={publishDocumentHandler}
            title={publishButtonTitle()}
          >
            {isPublishing && <SpinnerComponent width="12" height="12" color="#ffffff" />}
            {!isPublishing && <PublishIcon fill="#ffffff" />}
            <span className="label">Publish {publishString}</span>
          </button>
          }

        </div>
      </footer>
    </ProjectPermission>
  )
}

DocumentToolbarComponent.propTypes = {
  document: PropTypes.object,
  documentMode: PropTypes.string,
  isCreating: PropTypes.bool,
  isPublishing: PropTypes.bool,
  projectUsers: PropTypes.array,
  publishDocumentHandler: PropTypes.func,
  removeDocumentHandler: PropTypes.func,
  unpublishDocumentHandler: PropTypes.func,
}

export default DocumentToolbarComponent
