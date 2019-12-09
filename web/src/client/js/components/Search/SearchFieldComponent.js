import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'

import { PATH_DOCUMENT, PATH_PROJECT } from 'Shared/constants'
import { Popper, PopperGroup } from 'Components/Popper/Popper'
import { Menu, MenuHeader, MenuItem } from 'Components/Menu/Menu'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

const SearchFieldComponent = ({
  clearSearchHandler,
  documents,
  isSearching,
  projects,
  searchOptionsHandler,
  searchTerm
}) => {
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef()
  const formRef = useRef()

  const collapseCallback = useCallback(() => {
    setExpanded(false)
  }, [])

  const toggleCallback = useCallback(() => {
    inputRef.current.focus()
  }, [])

  useClickOutside(formRef, collapseCallback)
  useBlur(formRef, collapseCallback)
  useKeyboardShortcut('f', toggleCallback)

  return (
    <form className="search" ref={formRef}>
      <PopperGroup>
        <input
          aria-haspopup="true"
          aria-controls="search-field"
          type="search"
          onBlur={(e) => { clearSearchHandler(e.target.value) }}
          onChange={(e) => { searchOptionsHandler(e.target.value) }}
          onFocus={() => setExpanded(!expanded)}
          placeholder="Search..."
          ref={inputRef}
        />
        <Popper align="right" id="search-field" anchorRef={inputRef} open={!expanded}>
          {isSearching &&
          <MenuHeader>
            <h2>Searching for “<i>{searchTerm}</i>” <SpinnerComponent /></h2>
          </MenuHeader>
          }
          {searchTerm !== null && documents !== null && !isSearching &&
          <MenuHeader>
            <h2>Documents with “<i>{searchTerm}</i>”</h2>
          </MenuHeader>
          }
          {documents !== null && searchTerm !== null &&
          <Menu>
            {Object.values(documents).map((document) => {
              return (
                <MenuItem key={document.id}>
                  <Link
                    className="btn btn--blank"
                    key={`sf-${document.id}`}
                    to={`${PATH_PROJECT}/${document.projectId}/${PATH_DOCUMENT}/${document.id}`}
                  >
                    {document.name}
                  </Link>
                </MenuItem>
              )
            })}
          </Menu>
          }
          <MenuHeader>
            <h2>Projects</h2>
          </MenuHeader>
          <Menu>
            {Object.values(projects).map((project) => {
              return (
                <MenuItem key={project.id}>
                  <Link
                    className="btn btn--blank"
                    key={`sf-${project.id}`}
                    to={`${PATH_PROJECT}/${project.id}`}
                  >
                    {project.name}
                  </Link>
                </MenuItem>
              )
            })}
          </Menu>
        </Popper>
      </PopperGroup>
    </form>
  )
}

SearchFieldComponent.propTypes = {
  clearSearchHandler: PropTypes.func,
  documents: PropTypes.object,
  isSearching: PropTypes.bool,
  projects: PropTypes.object,
  searchOptionsHandler: PropTypes.func,
  searchTerm: PropTypes.string,
}

export default SearchFieldComponent
