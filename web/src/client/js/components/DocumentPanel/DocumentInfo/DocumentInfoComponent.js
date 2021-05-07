import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { DELETE_DOCUMENT_BUTTON_LABEL, UNPUBLISH_BUTTON_LABEL } from 'Loc/strings'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

import './DocumentInfoStyles.scss'

const DocumentInfoComponent = ({
  document,
  documentChangeHandler,
  isPublishing,
  removeDocumentHandler,
  unpublishDocumentHandler,
}) => {
  const documentNameRef = useRef()
  const [documentName, setDocumentName] = useState(document.name)

  useEffect(() => {
    if (window.document.activeElement !== documentNameRef) {
      setDocumentName(document.name)
    }
  }, [document.name])

  return (
    <div className="document-info">
      <dl className="document-info__list">
        <dt>
          <label
            className="document-panel__label"
            htmlFor="do-name"
          >
            Document name
          </label>
        </dt>
        <dd>
          <input
            className="document-panel__input"
            value={documentName}
            id="do-name"
            onChange={(e) => {
              setDocumentName(e.target.value)
              documentChangeHandler({ name: e.target.value })
            }}
            placeholder="Enter a document name"
            ref={documentNameRef}
          />
        </dd>
        <dt>
          <label
            className="document-panel__label"
            htmlFor="do-label"
          >
            Document slug
          </label>
        </dt>
        <dd>
          <input
            className="document-panel__input"
            defaultValue={document.slug}
            id="do-label"
            maxLength={140}
            onChange={(e) => {
              if (e.target.value.match(/^[a-z0-9-]+$/) === null) {
                e.target.setCustomValidity('Please use lowercase letters, numbers, and hyphens only')
                e.target.reportValidity()
              } else {
                e.target.setCustomValidity('')
                documentChangeHandler({ slug: e.target.value })
              }
            }}
            placeholder="document-label"
            pattern="^[a-z0-9-]+$"
          />
          <span className="note">Use the document slug in your URLs. Changing this may affect any existing applications.</span>
        </dd>
        <dt className="document-panel__definiton-list-divider--top">Last update</dt>
        <dd>{moment(document.updatedAt).fromNow()}</dd>
        {document.lastPublishedAt !== null &&
        <>
        <dt>Last published</dt>
        <dd title={moment(document.lastPublishedAt).format('MMMM do, YYYY - h:mma')}>
          {moment(document.lastPublishedAt).fromNow()}
        </dd>
        </>
        }
        <dt>Created on</dt>
        <dd>{moment(document.createdAt).format('MMMM do, YYYY - h:mma')}</dd>
      </dl>
      <div className="document-info__actions">
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
      </div>
    </div>
  )
}

DocumentInfoComponent.propTypes = {
  document: PropTypes.object,
  documentChangeHandler: PropTypes.func.isRequired,
  isPublishing: PropTypes.bool.isRequired,
  removeDocumentHandler: PropTypes.func.isRequired,
  unpublishDocumentHandler: PropTypes.func.isRequired,
}

export default DocumentInfoComponent
