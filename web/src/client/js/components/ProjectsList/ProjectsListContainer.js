import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { fetchProjects } from 'Actions/project'
import ProjectsListItem from './ProjectsListItem'

class ProjectsListContainer extends React.Component {
  componentDidMount() {
    this.props.fetchProjects()
  }

  renderProjectList() {
    if (typeof this.props.projects !== 'undefined') {
      return Object.keys(this.props.projects).map((project, index) => {
        return (
          <ProjectsListItem
            key={index}
            projectId={project}
            project={this.props.projects[project]}
          />
        )
      })
    }
  }

  render() {
    return (
      <div>
        <ol>{this.renderProjectList()}</ol>
      </div>
    )
  }
}

ProjectsListContainer.propTypes = {
  fetchProjects: PropTypes.func,
  projects: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchProjects }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectsListContainer)
