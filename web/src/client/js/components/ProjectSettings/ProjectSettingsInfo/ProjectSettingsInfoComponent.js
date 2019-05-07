import React from 'react'
import PropTypes from 'prop-types'

import TextField from 'Components/Form/TextField'
import Checkbox from 'Components/Form/Checkbox'
import { PROJECT_ACCESS_LEVELS } from 'Shared/constants'

const ProjectSettingsInfoComponent = ({ project, updateProjectHandler }) => {
  if (!project) return null
  const helpText = "Checking this box allows anyone in your organization to view this project's documents, whether they are part of the project team or not"
  return (
    <form className="project-settings__info" onSubmit={(e) => { e.preventDefault() }}>
      <section>
        <h2>General information</h2>
        <TextField
          id="projectName"
          label="Project Name"
          name="project[name]"
          onChange={(e) => { updateProjectHandler({ name: e.target.value }) }}
          placeholder="My project"
          value={project.name} />
        <TextField
          id="projectDescription"
          label="Description (optional)"
          large
          name="project[description]"
          onChange={(e) => { updateProjectHandler({ description: e.target.value }) }}
          placeholder=""
          value={project.description} />
      </section>
      <section>
        <h2>Privacy</h2>
        <Checkbox
          id="projectPrivacy"
          help={helpText}
          label="Make this project public"
          name="project[privacy]"
          onChange={(e) => {
            const accessLevel = e.target.checked ? PROJECT_ACCESS_LEVELS.READ : null
            updateProjectHandler({ accessLevel })
          }}
          value={project.accessLevel === PROJECT_ACCESS_LEVELS.READ} />
      </section>
    </form>
  )
}

ProjectSettingsInfoComponent.propTypes = {
  project: PropTypes.object.isRequired,
  updateProjectHandler: PropTypes.func.isRequired
}

export default ProjectSettingsInfoComponent
