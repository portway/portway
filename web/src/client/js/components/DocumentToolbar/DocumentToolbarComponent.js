import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { PublishIcon } from 'Components/Icons'
import ContentMenuContainer from 'Components/ContentMenu/ContentMenuContainer'
import FormatMenuContainer from 'Components/FormatMenu/FormatMenuContainer'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

import './_DocumentToolbar.scss'

const DocumentToolbarComponent = ({
  document, isCreating, isPublishing, projectUsers, publishDocumentHandler
}) => {
  const publishDisabled = moment(document.updatedAt).isSameOrBefore(document.lastPublishedAt, 'second')
  const publishString = document.lastPublishedAt === null ? 'document' : 'changes'
  function publishButtonTitle() {
    if (document && document.publishedVersionId && document.lastPublishedAt) {
      return `Published ${moment(document.lastPublishedAt).fromNow()}`
    } else {
      return 'Publish document'
    }
  }

  return (
    <footer className="document-toolbar">
      <div className="document-toolbar__start">
        <FormatMenuContainer />
        <ContentMenuContainer />
      </div>
      <div className="document-toolbar__end">
        {/* <!--Team menu--> */}
        {document &&
        <div className="document-toolbar__info">
          Last update:&nbsp;
          <span title={moment(document.updatedAt).format('MMMM do, YYYY - h:mma')}>
            {moment(document.updatedAt).fromNow()}
          </span>
        </div>
        }
        <button
          className="btn btn--small btn--with-icon"
          disabled={isPublishing || publishDisabled}
          onClick={publishDocumentHandler}
          title={publishButtonTitle()}>
          {isPublishing && <SpinnerComponent width="12" height="12" color="#ffffff" />}
          {!isPublishing && <PublishIcon fill="#ffffff" />}
          <span className="label">Publish {publishString}</span>
        </button>
      </div>
    </footer>
  )
}

DocumentToolbarComponent.propTypes = {
  document: PropTypes.object,
  isCreating: PropTypes.bool,
  isPublishing: PropTypes.bool,
  projectUsers: PropTypes.array,
  publishDocumentHandler: PropTypes.func,
}

export default DocumentToolbarComponent
