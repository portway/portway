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

  const helpText = "Checking this box allows anyone in your organization to view this project's documents, whether they are part of the project team or not"

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
          <FormField
            id="projectPrivacy"
            help={helpText}
            label="Make this project public"
            name="project[privacy]"
            errors={errors.privacy}
            onChange={(e) => {
              const accessLevel = e.target.checked ? PROJECT_ACCESS_LEVELS.READ : null
              setProjectAccessLevel(accessLevel)
            }}
            type="checkbox"
            value={project.accessLevel === PROJECT_ACCESS_LEVELS.READ} />
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
