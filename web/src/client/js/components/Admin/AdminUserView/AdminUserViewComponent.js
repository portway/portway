import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router-dom'

import { ArrowIcon, RemoveIcon } from 'Components/Icons'
import { ORGANIZATION_ROLE_IDS, PATH_ADMIN } from 'Shared/constants'
import OrgRolesDropdown from 'Components/RolesDropdowns/OrgRolesDropdown'
import ProjectRolesDropdown from 'Components/RolesDropdowns/ProjectRolesDropdown'
import Table from 'Components/Table/Table'

import './_AdminUserView.scss'

const AdminUserViewComponent = ({
  projectAssignments,
  projectRoleChangeHandler,
  removeProjectHandler,
  roleChangeHandler,
  userProjects,
  user
}) => {
  const projectTableHeadings = {
    project: { label: 'Project Name' },
    projectRole: { label: 'Project Role' },
    tools: { label: '' }
  }

  function renderProjectTools(projectId, assignmentId) {
    return (
      <div className="table__tools">
        <button
          aria-label="Remove project"
          className="btn btn--blank btn--with-circular-icon"
          onClick={() => removeProjectHandler(projectId, assignmentId) }>
          <RemoveIcon />
          <span className="label danger">Un-assign</span>
        </button>
      </div>
    )
  }

  const projectTableRows = {}
  if (userProjects && projectAssignments) {
    Object.values(userProjects).forEach((project) => {
      const assignment = projectAssignments[project.id]
      if (!assignment) return
      projectTableRows[project.id] = [
        project.name,
        <ProjectRolesDropdown
          key={project.id}
          defaultValue={assignment.roleId}
          onChange={value => projectRoleChangeHandler(project.id, assignment.id, value) } />,
        renderProjectTools(project.id, assignment.id)
      ]
    })
  }

  return (
    <div className="admin-user">
      <Link to={`${PATH_ADMIN}/users`} className="link--back">
        <ArrowIcon direction="left" /><span className="label">Back to Users</span>
      </Link>
      <header className="header">
        <h2>{user.name}</h2>
      </header>
      <section>
        <h2>General Information</h2>
        <dl className="admin-user__definition-list">
          <dt>Email</dt>
          <dd><a href={`mailto:${user.email}`}>{user.email}</a></dd>
          <dt>Date added</dt>
          <dd>{moment(user.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}</dd>
          {user.orgRoleId !== ORGANIZATION_ROLE_IDS.OWNER &&
          <>
          <dt>User role</dt>
          <dd><OrgRolesDropdown defaultValue={user.orgRoleId} onChange={roleChangeHandler} /></dd>
          </>
          }
        </dl>
      </section>
      <section>
        <h2>{user.name}&apos;s Projects</h2>
        <Table headings={projectTableHeadings} rows={projectTableRows} />
      </section>

    </div>
  )
}

AdminUserViewComponent.propTypes = {
  projectAssignments: PropTypes.object,
  projectRoleChangeHandler: PropTypes.func.isRequired,
  removeProjectHandler: PropTypes.func.isRequired,
  roleChangeHandler: PropTypes.func.isRequired,
  userProjects: PropTypes.object,
  user: PropTypes.object.isRequired
}

export default AdminUserViewComponent
