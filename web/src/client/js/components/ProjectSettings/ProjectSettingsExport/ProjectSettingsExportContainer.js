import React from 'react'
// import PropTypes from 'prop-types'
import { useLocation, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { PRODUCT_NAME } from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'
import dataMapper from 'Libs/dataMapper'

import ProjectSettingsExportComponent from './ProjectSettingsExportComponent'

const ProjectSettingsExportContainer = () => {
  const { projectId } = useParams()
  const location = useLocation()
  const { data: project } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])
  const { data: documents, loading } = useDataService(dataMapper.documents.list(projectId), [projectId])
  const numberOfDocuments = documents && Object.keys(documents).length

  return (
    <>
      <Helmet>
        <title>{project.name}: Export options –– {PRODUCT_NAME}</title>
      </Helmet>
      <ProjectSettingsExportComponent
        loading={loading}
        numberOfDocuments={numberOfDocuments}
        project={project}
      />
    </>
  )
}

ProjectSettingsExportContainer.propTypes = {
}

export default ProjectSettingsExportContainer
