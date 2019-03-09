import React from 'react'
import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
import useDataService from '../../hooks/useDataService'

import ProjectsListItem from './ProjectsListItem'

function ProjectsListContainer(props) {
  useDataService('projects')

  const projectList = Object.keys(props.projects).map((projectId) => {
    return (
      <ProjectsListItem key={projectId} projectId={projectId} project={props.projects[projectId]} />
    )
  })

  return (
    <div>
      <ol>{projectList}</ol>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return bindActionCreators({ fetchProjects }, dispatch)
// }

export default connect(
  mapStateToProps
  // mapDispatchToProps
)(ProjectsListContainer)
