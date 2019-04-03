import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import Constants from 'Shared/constants'
import ToolbarComponent from 'Components/Toolbar/ToolbarComponent'
import ProjectsListContainer from 'Components/ProjectsList/ProjectsListContainer'

class ProjectsContainer extends React.PureComponent {
  render() {
    const toolbarAction = {
      callback: () => {
        this.props.history.push({ pathname: Constants.PATH_PROJECT_CREATE })
      },
      label: `New Project`,
      icon: 'icon-add'
    }
    return (
      <main>
        <ToolbarComponent action={toolbarAction} filter sort />
        <ProjectsListContainer />
      </main>
    )
  }
}

ProjectsContainer.propTypes = {
  history: PropTypes.object.isRequired
}

export default withRouter(ProjectsContainer)
