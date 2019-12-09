import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import currentResource from 'Libs/currentResource'
import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import { searchDocuments } from 'Actions/document'
import SearchFieldComponent from './SearchFieldComponent'

const SearchFieldContainer = ({ documents, searchDocuments }) => {
  const { data: projects } = useDataService(dataMapper.projects.list())
  const { data: project } = useDataService(
    currentResource('project', location.pathname), [location.pathname]
  )

  function searchOptionsHandler(inputValue) {
    if (project && project.id) {
      searchDocuments(project.id, inputValue)
    }
  }

  return (
    <SearchFieldComponent
      documents={documents}
      project={project}
      projects={projects}
      searchOptionsHandler={searchOptionsHandler}
    />
  )
}

SearchFieldContainer.propTypes = {
  documents: PropTypes.array,
  searchDocuments: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    documents: state.documents.documentSearchResults
  }
}

const mapDispatchToProps = { searchDocuments }

export default connect(mapStateToProps, mapDispatchToProps)(SearchFieldContainer)
