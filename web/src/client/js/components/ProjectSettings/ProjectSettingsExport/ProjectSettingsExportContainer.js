import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { PRODUCT_NAME } from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'
import dataMapper from 'Libs/dataMapper'
import { exportProject, clearProjectExportUrl } from 'Actions/project'

import ProjectSettingsExportComponent from './ProjectSettingsExportComponent'

const ProjectSettingsExportContainer = ({ exportProject, clearProjectExportUrl, exportsLoading, exportUrls }) => {
  const { projectId } = useParams()
  const location = useLocation()
  const { data: project } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])
  const { data: documents, loading } = useDataService(dataMapper.documents.list(projectId), [projectId])
  const numberOfDocuments = documents && Object.keys(documents).length

  const handleExport = () => {
    exportProject(projectId)
  }

  // need to clear out the export url if navigating away from this component
  useEffect(() => {
    return () => {
      clearProjectExportUrl(projectId)
    }
  }, [clearProjectExportUrl, projectId])

  return (
    <>
      <Helmet>
        <title>{project.name}: Export options –– {PRODUCT_NAME}</title>
      </Helmet>
      <ProjectSettingsExportComponent
        loading={loading}
        numberOfDocuments={numberOfDocuments}
        project={project}
        handleExport={handleExport}
        exportLoading={exportsLoading[projectId]}
        exportUrl={exportUrls[projectId]}
      />
    </>
  )
}

ProjectSettingsExportContainer.propTypes = {
  clearProjectExportUrl: PropTypes.func.isRequired,
  exportProject: PropTypes.func.isRequired,
  exportsLoading: PropTypes.object,
  exportUrls: PropTypes.object,
}

const mapStateToProps = (state) => {
  return {
    exportsLoading: state.projects.loading.exportById,
    exportUrls: state.projects.exportUrlsById
  }
}

const mapDispatchToProps = {
  exportProject,
  clearProjectExportUrl
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSettingsExportContainer)
