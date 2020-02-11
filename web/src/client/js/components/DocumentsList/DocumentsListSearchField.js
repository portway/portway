import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import cx from 'classnames'

import { RemoveIcon, SearchIcon } from 'Components/Icons'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'
import { IconButton } from 'Components/Buttons/index'

const DocumentsListSearchField = ({ clearSearchHandler, disabled, searchDocumentsHandler }) => {
  const [isSearching, setIsSearching] = useState(false)
  const searchFieldRef = useRef()
  const { projectId } = useParams()

  useKeyboardShortcut('f', () => {
    searchFieldRef.current.focus()
    setIsSearching(true)
  })

  // Reset search box if the project id changes
  useEffect(() => {
    setIsSearching(false)
    if (searchFieldRef.current) {
      searchFieldRef.current.value = ''
    }
  }, [projectId])

  const searchClasses = cx({
    'documents-list__search': true,
    'documents-list__search--disabled': disabled,
  })

  function clearSearchValues() {
    setIsSearching(false)
    searchFieldRef.current.value = ''
    clearSearchHandler()
  }

  return (
    <div className={searchClasses}>
      <div className="documents-list__search-field">
        <label aria-label="Search documents" htmlFor="document-search-field"><SearchIcon /></label>
        <input
          id="document-search-field"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          onChange={(e) => {
            if (e.target.value === '' && isSearching) {
              setIsSearching(false)
              searchDocumentsHandler(e.target.value)
              return
            }
            setIsSearching(true)
            searchDocumentsHandler(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'escape') {
              clearSearchValues()
            }
          }}
          placeholder="Search documents..."
          ref={searchFieldRef}
          type="search"
        />
        {isSearching &&
        <IconButton color="transparent" onClick={clearSearchValues}>
          <RemoveIcon width="12" height="12" />
        </IconButton>
        }
      </div>
    </div>
  )
}

DocumentsListSearchField.propTypes = {
  clearSearchHandler: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  searchDocumentsHandler: PropTypes.func.isRequired,
}

export default DocumentsListSearchField
