import React from 'react'
import PropTypes from 'prop-types'

import './DocumentInfoStyles.scss'

const DocumentInfoComponent = ({ document, documentChangeHandler }) => {
  const tooltip = 'Use the document label in your URLs. Changing this may affect any existing applications.'
  return (
    <div className="document-info">
      <div className="document-info__row">
        <label
          className="document-info__label"
          htmlFor="do-label"
          title={tooltip}
        >
          Document label
        </label>
        <input
          className="document-info__input"
          defaultValue={document.slug}
          id="do-label"
          maxLength={140}
          onChange={(e) => {
            if (e.target.value.match(/^[a-z0-9-]+$/) === null) {
              e.target.setCustomValidity('Please use lowercase letters, numbers, and hyphens only')
            } else {
              e.target.setCustomValidity('')
              documentChangeHandler(e.target.value)
            }
          }}
          placeholder="document-label"
          pattern="^[a-z0-9-]+$"
          title={tooltip}
        />
      </div>
    </div>
  )
}

DocumentInfoComponent.propTypes = {
  document: PropTypes.object,
  documentChangeHandler: PropTypes.func.isRequired,
}

export default DocumentInfoComponent
