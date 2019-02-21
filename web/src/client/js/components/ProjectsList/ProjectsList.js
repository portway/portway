import React from 'react'
import PropTypes from 'prop-types'

import ProjectsListItem from './ProjectsListItem'

class ProjectsListComponent extends React.PureComponent {
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

ProjectsListComponent.propTypes = {
  projects: PropTypes.object
}

export default ProjectsListComponent
