import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router-dom'

import { RemoveIcon } from 'Components/Icons'
import { PATH_ADMIN, ORGANIZATION_ROLE_IDS } from 'Shared/constants'
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
    project: { label: 'Project Name', sortable: true },
    projectRole: { label: 'Project Role', sortable: true },
    tools: { label: '' }
  }

  function renderProjectTools(projectId, assignmentId) {
    return (
      <div className="table__tools">
        <button
          className="btn btn--blank btn--with-circular-icon btn--danger"
          onClick={() => removeProjectHandler(projectId, assignmentId) }>
          <RemoveIcon />
          <span className="label">Un-assign</span>
        </button>
      </div>
    )
  }

  const projectTableRows = {}
  if (userProjects && projectAssignments) {
    Object.values(userProjects).forEach((project) => {
      const assignment = projectAssignments[project.id]
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
      <header className="header header--with-button">
        <h2>{user.name}</h2>
        <Link to={`${PATH_ADMIN}/users`} className="btn btn--blank btn--with-circular-icon admin-user__back-btn">
          <span className="label">Back to Users</span>
          <RemoveIcon />
        </Link>
      </header>
      <section>
        <h2>General Information</h2>
        <dl className="admin-user__definition-list">
          <dt>Email</dt>
          <dd><a href={`mailto:${user.email}`}>{user.email}</a></dd>
          <dt>Date added</dt>
          <dd>{moment(user.createdAt).format()}</dd>
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
