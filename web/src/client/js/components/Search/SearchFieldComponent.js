import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'

import { PATH_DOCUMENT, PATH_PROJECT } from 'Shared/constants'
import { SearchIcon } from 'Components/Icons'
import { Popper, PopperGroup } from 'Components/Popper/Popper'
import { Menu, MenuHeader, MenuItem } from 'Components/Menu'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

import './_SearchField.scss'

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

  const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-text-color')

  return (
    <form className="search" ref={formRef}>
      <PopperGroup>
        <div className="search-field">
          <label aria-label="Search documents and projects">
            <SearchIcon />
            <input
              aria-haspopup="true"
              aria-controls="search-field"
              defaultValue={searchTerm}
              type="search"
              onBlur={(e) => { clearSearchHandler() }}
              onChange={(e) => { searchOptionsHandler(e.target.value) }}
              onFocus={(e) => {
                setExpanded(true)
                e.target.select()
              }}
              placeholder="Search..."
              ref={inputRef}
            />
          </label>
        </div>
        <Popper
          align="right"
          anchorRef={inputRef}
          autoCollapse={collapseCallback}
          id="search-field"
          open={expanded || searchTerm !== null || document.activeElement === inputRef.current}
          width="300"
        >
          <Menu anchorRef={inputRef} isActive={expanded}>
            {isSearching &&
            <MenuHeader>
              <SpinnerComponent color={themeColor} />
            </MenuHeader>
            }
            {searchTerm !== null && documents !== null && !isSearching &&
            <MenuHeader>
              <h2>Documents with “{searchTerm}”</h2>
            </MenuHeader>
            }
            {documents !== null && searchTerm !== null && Object.values(documents).length === 0 &&
            <MenuItem padded><span className="small">No documents...</span></MenuItem>
            }
            {documents !== null && Object.values(documents).map((document) => {
              return (
                <MenuItem key={document.id}>
                  <Link
                    className="btn btn--blank"
                    key={`sf-${document.id}`}
                    ref={React.createRef()}
                    to={`${PATH_PROJECT}/${document.projectId}${PATH_DOCUMENT}/${document.id}`}
                  >
                    {document.name}
                  </Link>
                </MenuItem>
              )
            })
            }
            <MenuHeader>
              <h2>Projects {searchTerm && <>with “{searchTerm}”</> }</h2>
            </MenuHeader>
            {projects.length === 0 &&
            <MenuItem padded><span className="small">No projects...</span></MenuItem>
            }
            {projects.map((project) => {
              return (
                <MenuItem key={project.id}>
                  <Link
                    className="btn btn--blank"
                    key={`sf-${project.id}`}
                    ref={React.createRef()}
                    to={`${PATH_PROJECT}/${project.id}`}
                  >
                    {project.name}
                  </Link>
                </MenuItem>
              )
            })
            }
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
  projects: PropTypes.array,
  searchOptionsHandler: PropTypes.func,
  searchTerm: PropTypes.string,
}

export default SearchFieldComponent
