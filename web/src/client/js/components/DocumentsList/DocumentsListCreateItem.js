import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { LABEL_NEW_DOCUMENT } from 'Shared/constants'
import { AddIcon, RemoveIcon } from 'Components/Icons'
import { IconButton } from 'Components/Buttons'

import useClickOutside from 'Hooks/useClickOutside'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

const DocumentsListCreateItem = ({ active, createDocumentHandler, isCreating, toggleCreateMode }) => {
  const listItemRef = useRef()
  const nameRef = useRef()

  // Select the contents of the contentEditable div (new document name)
  useEffect(() => {
    if (active && nameRef.current && !isCreating) {
      nameRef.current.select()
    }
  })

  useClickOutside(listItemRef, () => {
    if (active) {
      if (nameRef.current.value !== LABEL_NEW_DOCUMENT) {
        createDocumentHandler(nameRef.current.value)
      } else {
        toggleCreateMode(false)
      }
    }
  }, { preventEscapeFunctionality: true }
  )

  if (active) {
    return (
      <li className="documents-list__item documents-list__item--new" ref={listItemRef}>
        <div className="documents-list__button">
          <input
            className="documents-list__name"
            defaultValue={LABEL_NEW_DOCUMENT}
            disabled={isCreating}
            name="newDocument"
            onKeyDown={(e) => {
              if (e.keyCode === 27) {
                e.preventDefault()
                toggleCreateMode(false)
              }
              if (e.key.toLowerCase() === 'enter') {
                e.preventDefault()
                createDocumentHandler(e.target.value)
              }
            }}
            ref={nameRef}
            type="text"
          />
          {isCreating && <SpinnerComponent color="var(--theme-overlay-dark)" />}
          <IconButton
            aria-label="Cancel creating document"
            color="transparent"
            disabled={isCreating}
            onClick={() => { toggleCreateMode(false) }}
          >
            <RemoveIcon width="12" height="12" />
          </IconButton>
          <IconButton
            aria-label="Create the document"
            color="green"
            disabled={isCreating}
            onClick={() => {
              createDocumentHandler(nameRef.current.value)
            }}
          >
            <AddIcon fill="var(--theme-surface)" />
          </IconButton>
        </div>
      </li>
    )
  }
  return null
}

DocumentsListCreateItem.propTypes = {
  active: PropTypes.bool.isRequired,
  createDocumentHandler: PropTypes.func.isRequired,
  isCreating: PropTypes.bool.isRequired,
  toggleCreateMode: PropTypes.func.isRequired,
}

export default DocumentsListCreateItem
