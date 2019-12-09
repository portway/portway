import React from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'

import currentResource from 'Libs/currentResource'
import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import { debounce } from 'Shared/utilities'
import { searchDocuments } from 'Actions/document'
import SearchFieldComponent from './SearchFieldComponent'

const SearchFieldContainer = ({ documents, isSearching, searchDocuments, searchTerm }) => {
  const location = useLocation()
  const { data: projects } = useDataService(dataMapper.projects.list())
  const { data: project } = useDataService(
    currentResource('project', location.pathname), [location.pathname]
  )

  const searchOptionsHandler = debounce(200, (inputValue) => {
    if (project.id && inputValue !== searchTerm) {
      searchDocuments(project.id, inputValue)
    }
  })

  return (
    <SearchFieldComponent
      documents={documents}
      isSearching={isSearching}
      projects={projects}
      searchOptionsHandler={searchOptionsHandler}
      searchTerm={searchTerm}
    />
  )
}

SearchFieldContainer.propTypes = {
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

const mapDispatchToProps = { searchDocuments }

export default connect(mapStateToProps, mapDispatchToProps)(SearchFieldContainer)
