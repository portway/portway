import React from 'react'
import PropTypes from 'prop-types'

import ToolbarComponent from 'Components/Toolbar/ToolbarComponent'

function ProjectDocuments({ toolbarCallback, project }) {
  const toolbarAction = {
    callback: toolbarCallback,
    label: `New Document in ${project.name}`,
    icon: 'icon-add'
  }
  return (
    <>
      <ToolbarComponent action={toolbarAction} filter sort />
    </>
  )
}

ProjectDocuments.propTypes = {
  toolbarCallback: PropTypes.func,
  project: PropTypes.object.isRequired
}

export default ProjectDocuments
