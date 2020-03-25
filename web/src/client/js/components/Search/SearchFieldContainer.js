import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'

import currentResource from 'Libs/currentResource'
import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import { debounce } from 'Shared/utilities'
import { clearSearch, searchDocuments } from 'Actions/search'
import SearchFieldComponent from './SearchFieldComponent'

const SearchFieldContainer = ({
  clearSearch,
  documents,
  isSearching,
  searchDocuments,
  searchTerm
}) => {
  const location = useLocation()
  const { data: { projects } } = useDataService(dataMapper.projects.list())
  const { data: project } = useDataService(
    currentResource('project', location.pathname), [location.pathname]
  )
  const [filteredProjects, setFilteredProjects] = useState([])

  useEffect(() => {
    if (Object.values(projects).length > 0) {
      setFilteredProjects(Object.values(projects))
    }
  }, [projects])

  function clearSearchHandler() {
    clearSearch()
    setFilteredProjects(Object.values(projects))
  }

  const searchOptionsHandler = debounce(200, (inputValue) => {
    if (inputValue.trim() === '') {
      clearSearch()
      setFilteredProjects(Object.values(projects))
      return
    }
    // First, let's filter the project names
    const fp = Object.values(projects).filter((project) => {
      return project.name.includes(inputValue)
    })
    setFilteredProjects(fp)
    // if we have a project id, search for documents
    if (project && project.id && inputValue !== searchTerm) {
      searchDocuments(project.id, inputValue)
    }
  })

  return (
    <SearchFieldComponent
      clearSearchHandler={clearSearchHandler}
      documents={documents}
      isSearching={isSearching}
      projects={filteredProjects}
      searchOptionsHandler={searchOptionsHandler}
      searchTerm={searchTerm}
    />
  )
}

SearchFieldContainer.propTypes = {
  clearSearch: PropTypes.func,
  documents: PropTypes.object,
  isSearching: PropTypes.bool,
  searchTerm: PropTypes.string,
  searchDocuments: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    documents: state.search.searchResultsByDocumentId,
    isSearching: state.search.isSearching,
    searchTerm: state.search.searchTerm,
  }
}

const mapDispatchToProps = { clearSearch, searchDocuments }

export default connect(mapStateToProps, mapDispatchToProps)(SearchFieldContainer)
