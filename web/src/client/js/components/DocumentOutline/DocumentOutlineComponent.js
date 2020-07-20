import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Link, useParams } from 'react-router-dom'

import { slugify } from 'Utilities/slugify'
import { PATH_PROJECT, PROJECT_ROLE_IDS } from 'Shared/constants'
import { RemoveIcon } from 'Components/Icons'
import { IconButton } from 'Components/Buttons'
import ProjectPermission from 'Components/Permission/ProjectPermission'

import DocumentOutlineItem from './DocumentOutlineItem'

import './_DocumentOutline.scss'

const DocumentOutlineComponent = ({
  currentDocument,
  documentSlugHandler,
  dragEndHandler,
  dragEnterHandler,
  dragLeaveHandler,
  dragStartHandler,
  dropHandler,
  fields,
  fieldsUpdating,
  fieldDestroyHandler,
  fieldRenameHandler,
  toggleDocumentModeHandler
}) => {
  const outlineRef = useRef()
  const { projectId } = useParams()
  useEffect(() => {
    const outlineCopy = outlineRef.current
    if (outlineCopy) {
      outlineCopy.classList.add('document-outline--active')
    }
    return () => {
      outlineCopy.classList.remove('document-outline--active')
    }
  })
  return (
    <div className="document-outline" ref={outlineRef}>
      <div className="document-outline__header">
        <h2 className="document-outline__title">Document info</h2>
        <IconButton className="document-outline__toggle" color="surface" onClick={toggleDocumentModeHandler} title="Exit outline">
          <RemoveIcon width="14" height="14" />
        </IconButton>
      </div>
      <div className="document-outline__panel">
        <div className="document-outline__panel-text">
          <p className="note">Use the document label in your URLs. Changing this may affect any existing applications.</p>
        </div>
        <div className="document-outline__panel-item">
          <label className="document-outline__label" htmlFor="do-label">
            Document label
          </label>
          <input
            className="document-outline__input"
            defaultValue={currentDocument.slug}
            id="do-label"
            onChange={(e) => {
              if (e.target.value.match(/^[a-z0-9-]+$/) === null) {
                e.target.setCustomValidity('Please use lowercase letters, numbers, and hyphens only')
              } else {
                e.target.setCustomValidity('')
                documentSlugHandler(e.target.value)
              }
            }}
            placeholder="document-label"
            pattern="^[a-z0-9-]+$"
            type="text"
          />
        </div>
      </div>
      <header className="document-outline__header">
        <h2 className="document-outline__title">Document outline</h2>
        <p className="document-outline__description note">Drag and drop to reorder your document, or remove fields altogether</p>
        <ProjectPermission acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN]}>
          <p className="document-outline__description note">Name your fields for use in <Link to={`${PATH_PROJECT}/${projectId}/settings/keys`}>the API</Link></p>
        </ProjectPermission>
      </header>
      <ol className="document-outline__list" onDrop={dropHandler}>
        {fields.map((field, index) => {
          return (
            <DocumentOutlineItem
              dragEndHandler={dragEndHandler}
              dragEnterHandler={dragEnterHandler}
              dragLeaveHandler={dragLeaveHandler}
              dragStartHandler={dragStartHandler}
              dropHandler={dropHandler}
              field={field}
              index={index}
              isUpdating={fieldsUpdating[field.id]}
              key={field.id}
              onDestroy={() => { fieldDestroyHandler(field.id, field.type) }}
              onRename={fieldRenameHandler}
            />
          )
        })}
      </ol>
    </div>
  )
}

DocumentOutlineComponent.propTypes = {
  currentDocument: PropTypes.object,
  documentSlugHandler: PropTypes.func.isRequired,
  dragEndHandler: PropTypes.func.isRequired,
  dragEnterHandler: PropTypes.func.isRequired,
  dragLeaveHandler: PropTypes.func.isRequired,
  dragStartHandler: PropTypes.func.isRequired,
  dropHandler: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  fieldsUpdating: PropTypes.object,
  fieldDestroyHandler: PropTypes.func.isRequired,
  fieldRenameHandler: PropTypes.func.isRequired,
  toggleDocumentModeHandler: PropTypes.func.isRequired,
}

export default DocumentOutlineComponent
