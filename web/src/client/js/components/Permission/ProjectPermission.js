import React from 'react'
import PropTypes from 'prop-types'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

const ProjectPermission = ({ children, elseRender, acceptedRoleIds, projectId }) => {
  const rejectRender = elseRender || null

  const { data: userProjectAssignments } = useDataService(dataMapper.users.currentUserProjectAssignments())

  const { data: project } = useDataService(dataMapper.projects.id(projectId))

  if (!userProjectAssignments) return rejectRender

  const projectAssignment = userProjectAssignments[projectId]

  console.log(projectAssignment)
  console.log(project)

  if (projectAssignment && acceptedRoleIds.indexOf(projectAssignment.roleId) > -1) {
    return (
      <>
        {children}
      </>
    )
  }

  return (
    <>
      {rejectRender}
    </>
  )
}

ProjectPermission.propTypes = {
  children: PropTypes.node.isRequired,
  elseRender: PropTypes.node,
  acceptedRoleIds: PropTypes.array.isRequired,
  projectId: PropTypes.number.isRequired
}

export default ProjectPermission

export const withProjectPermission = (acceptedRoleIds, elseRender) => {
  return (WrappedComponent) => {
    class HOC extends React.Component {
      render() {
        return (
          <ProjectPermission acceptedRoleIds={acceptedRoleIds} elseRender={elseRender}>
            <WrappedComponent
              {...this.props}
            />
          </ProjectPermission>
        )
      }
    }

    return HOC
  }
}