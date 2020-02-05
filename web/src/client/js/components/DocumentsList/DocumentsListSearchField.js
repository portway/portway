import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import cx from 'classnames'

import { SearchIcon } from 'Components/Icons'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'

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

  return (
    <div className={searchClasses}>
      <div className="documents-list__search-field">
        <SearchIcon />
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          onChange={(e) => {
            if (!isSearching) {
              setIsSearching(true)
            }
            searchDocumentsHandler(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'escape') {
              setIsSearching(false)
              searchFieldRef.current.value = ''
              clearSearchHandler()
            }
          }}
          placeholder="Search documents..."
          ref={searchFieldRef}
          type="search"
        />
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
