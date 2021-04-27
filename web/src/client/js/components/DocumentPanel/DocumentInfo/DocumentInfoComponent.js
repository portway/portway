import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { set } from 'date-fns'

const DocumentInfoComponent = ({ document, documentChangeHandler }) => {
  const documentNameRef = useRef()
  const [documentName, setDocumentName] = useState(document.name)

  useEffect(() => {
    if (window.document.activeElement !== documentNameRef) {
      setDocumentName(document.name)
    }
  }, [document.name])

  return (
    <div className="document-info">
      <dl>
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
        <dt>Created on</dt>
        <dd>{moment(document.createdAt).format('MMMM do, YYYY - h:mma')}</dd>
      </dl>
    </div>
  )
}

DocumentInfoComponent.propTypes = {
  document: PropTypes.object,
  documentChangeHandler: PropTypes.func.isRequired,
}

export default DocumentInfoComponent
