import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { CaretIcon, PublishIcon } from 'Components/Icons'
import ContentMenuContainer from 'Components/ContentMenu/ContentMenuContainer'
import FormatMenuContainer from 'Components/FormatMenu/FormatMenuContainer'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'
import { DropdownComponent, DropdownItem } from 'Components/Dropdown/Dropdown'
import { ButtonGroup } from 'Components/Button/Button'

import './_DocumentToolbar.scss'

const DocumentToolbarComponent = ({
  document,
  isCreating,
  isPublishing,
  projectUsers,
  publishDocumentHandler,
  removeDocumentHandler,
  unpublishDocumentHandler,
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
        <ButtonGroup
          disabled={isPublishing || publishDisabled}
          small
          title={publishButtonTitle()}
        >
          <button className="btn btn--small btn--with-icon" onClick={publishDocumentHandler}>
            {isPublishing && <SpinnerComponent width="12" height="12" color="#ffffff" />}
            {!isPublishing && <PublishIcon fill="#ffffff" />}
            <span className="label">Publish {publishString}</span>
          </button>
          <DropdownComponent
            align="right"
            autoCollapse={true}
            button={{
              className: 'btn--small btn--with-icon',
              icon: <CaretIcon fill="#fff" />
            }}>
            <DropdownItem
              className="btn--small"
              label="Unpublish document"
              onClick={unpublishDocumentHandler}
              type="button"
            />
            <DropdownItem
              className="btn--small btn--danger"
              label="Delete document"
              onClick={removeDocumentHandler}
              type="button"
            />
          </DropdownComponent>
        </ButtonGroup>
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
  removeDocumentHandler: PropTypes.func,
  unpublishDocumentHandler: PropTypes.func,
}

export default DocumentToolbarComponent
