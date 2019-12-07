import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'

import { PATH_PROJECT } from 'Shared/constants'
import { Popper, PopperGroup } from 'Components/Popper/Popper'
import { Menu, MenuHeader, MenuItem } from 'Components/Menu/Menu'

const SearchFieldComponent = ({ documents, project, projects, searchOptionsHandler }) => {
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
          onChange={searchOptionsHandler}
          onFocus={() => setExpanded(true)}
          placeholder="Search..."
          ref={inputRef}
        />
        <Popper id="search-field" anchorRef={inputRef} open={!expanded}>
          {documents === null &&
          <Menu>
            <MenuHeader>
              <h2>Projects</h2>
            </MenuHeader>
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
          }
        </Popper>
      </PopperGroup>
    </form>
  )
}

SearchFieldComponent.propTypes = {
  documents: PropTypes.array,
  project: PropTypes.object,
  projects: PropTypes.object,
  searchOptionsHandler: PropTypes.func,
}

export default SearchFieldComponent
