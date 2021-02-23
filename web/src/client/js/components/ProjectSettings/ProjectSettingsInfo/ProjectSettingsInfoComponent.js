import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { PATH_PROJECT } from 'Shared/constants'
import { ArrowIcon } from 'Components/Icons'
import Form from 'Components/Form/Form'
import FormField from 'Components/Form/FormField'
import { PROJECT_ACCESS_LEVELS } from 'Shared/constants'

const ProjectSettingsInfoComponent = ({
  deleteProjectHandler,
  errors,
  formId,
  project,
  updateProjectHandler
}) => {
  const [projectName, setProjectName] = useState(project.name)
  const [projectDescription, setProjectDescription] = useState(project.description)
  const [projectAccessLevel, setProjectAccessLevel] = useState(project.accessLevel)

  if (!project) return null

  function submitHandler() {
    updateProjectHandler({
      accessLevel: projectAccessLevel,
      name: projectName,
      description: projectDescription,
    })
  }

  return (
    <>
      <Form className="project-settings__info" name={formId} onSubmit={submitHandler} submitLabel="Update project settings">
        <section>
          <Link to={`${PATH_PROJECT}/${project.id}`} className="link link--back"><ArrowIcon direction="left" /> Back to project</Link>
          <h2>General information</h2>
          <FormField
            id="projectName"
            label="Project name"
            name="name"
            errors={errors.name}
            onChange={(e) => { setProjectName(e.target.value) }}
            placeholder="My project"
            value={project.name} />
          <FormField
            id="projectDescription"
            label="Description (optional)"
            large
            name="description"
            errors={errors.description}
            onChange={(e) => { setProjectDescription(e.target.value) }}
            placeholder=""
            value={project.description} />
        </section>
        <section>
          <h2>Privacy</h2>
          <div className="project-settings__descriptions">
            {projectAccessLevel === null &&
              <p>Only the team you create for this project can view or edit this project, based on the role you give them.</p>
            }
            {projectAccessLevel === PROJECT_ACCESS_LEVELS.READ &&
              <p>Anyone in your organization can <b style={{ color: 'var(--color-green)' }}>read</b> this project’s documents, whether they are part of the project team or not.</p>
            }
            {projectAccessLevel === PROJECT_ACCESS_LEVELS.WRITE &&
              <p>Anyone in your organization can <b style={{ color: 'var(--color-red)' }}>edit</b> this project’s documents, whether they are part of the project team or not.</p>
            }
          </div>
          <FormField
            id="projectPrivacyDefault"
            label={<>Only the project team can view or edit this project</>}
            large
            name="project[privacy]"
            errors={errors.privacy}
            onChange={() => {
              setProjectAccessLevel(null)
            }}
            type="radio"
            value={project.accessLevel === null} />
          <FormField
            id="projectPrivacyRead"
            label={<>Everyone in my organization can <b>see</b> this project</>}
            large
            name="project[privacy]"
            errors={errors.privacy}
            onChange={() => {
              setProjectAccessLevel(PROJECT_ACCESS_LEVELS.READ)
            }}
            type="radio"
            value={project.accessLevel === PROJECT_ACCESS_LEVELS.READ} />
          <FormField
            id="projectPrivacyWrite"
            label={<>Everyone in my organization can <b>edit</b> this project</>}
            large
            name="project[privacy]"
            errors={errors.privacy}
            onChange={() => {
              setProjectAccessLevel(PROJECT_ACCESS_LEVELS.WRITE)
            }}
            type="radio"
            value={project.accessLevel === PROJECT_ACCESS_LEVELS.WRITE} />
        </section>
      </Form>
      <section>
        <h2 className="danger">Delete project</h2>
        <p>Delete this project, and all the documents it contains.</p>
        <button className="btn btn--white btn--danger" onClick={deleteProjectHandler}>Delete this project</button>
      </section>
    </>
  )
}

ProjectSettingsInfoComponent.propTypes = {
  deleteProjectHandler: PropTypes.func.isRequired,
  errors: PropTypes.object,
  formId: PropTypes.string,
  project: PropTypes.object.isRequired,
  updateProjectHandler: PropTypes.func.isRequired
}

export default ProjectSettingsInfoComponent
