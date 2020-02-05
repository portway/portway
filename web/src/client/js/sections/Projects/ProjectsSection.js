import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { AddIcon } from 'Components/Icons'
import Constants from 'Shared/constants'
import ToolbarComponent from 'Components/Toolbar/ToolbarComponent'
import ProjectsListContainer from 'Components/ProjectsList/ProjectsListContainer'
import OrgPermission from 'Components/Permission/OrgPermission'

const { ORGANIZATION_ROLE_IDS, ORGANIZATION_SETTINGS, PATH_PROJECT_CREATE } = Constants

const ProjectsContainer = () => {
  const history = useHistory()
  useEffect(() => {
    document.querySelector('body').classList.add('body--with-scrolling')
    return function cleanup() {
      document.querySelector('body').classList.remove('body--with-scrolling')
    }
  }, [])
  const toolbarAction = {
    callback: () => {
      history.push({ pathname: PATH_PROJECT_CREATE })
    },
    label: `New Project`,
    icon: <AddIcon width="12" height="12" />,
    title: 'New Project'
  }
  return (
    <main>
      <OrgPermission
        acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN]}
        acceptedSettings={[ORGANIZATION_SETTINGS.ALLOW_USER_PROJECT_CREATION]}
        elseRender={(
          <ToolbarComponent action={{}} />
        )}>
        <ToolbarComponent action={toolbarAction} />
      </OrgPermission>
      <ProjectsListContainer />
    </main>
  )
}

export default ProjectsContainer
