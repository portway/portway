import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import ProjectToolbarComponent from './ProjectToolbarComponent'

const ProjectToolbarContainer = ({ status }) => {
  const { projectId } = useParams()

  return (
    <ProjectToolbarComponent projectId={projectId} status={status} />
  )
}

ProjectToolbarContainer.propTypes = {
  status: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  return {
    status: state.ui.status
  }
}

export default connect(mapStateToProps)(ProjectToolbarContainer)
