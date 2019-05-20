import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { AddIcon } from 'Components/Icons'
import Constants from 'Shared/constants'
import ToolbarComponent from 'Components/Toolbar/ToolbarComponent'
import ProjectsListContainer from 'Components/ProjectsList/ProjectsListContainer'
import OrgPermission from 'Components/Permission/OrgPermission'

const { ORGANIZATION_ROLE_IDS, PATH_PROJECT_CREATE } = Constants

class ProjectsContainer extends React.PureComponent {
  render() {
    const toolbarAction = {
      callback: () => {
        this.props.history.push({ pathname: PATH_PROJECT_CREATE })
      },
      label: `New Project`,
      icon: <AddIcon width="12" height="12" />
    }
    return (
      <main>
        <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN]} elseRender={(
          <ToolbarComponent action={{}} filter sort />
        )}>
          <ToolbarComponent action={toolbarAction} filter sort />
        </OrgPermission>
        <ProjectsListContainer />
      </main>
    )
  }
}

ProjectsContainer.propTypes = {
  history: PropTypes.object.isRequired
}

export default withRouter(ProjectsContainer)
