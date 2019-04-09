import React from 'react'
import PropTypes from 'prop-types'

import TextField from 'Components/Form/TextField'
import Checkbox from 'Components/Form/Checkbox'

const ProjectSettingsInfoComponent = ({ project, onUpdateHandler }) => {
  if (!project) return null
  // eslint-disable-next-line max-len
  const helpText = "Checking this box allows anyone in your organization to view this project's documents, whether they are part of the project team or not"
  return (
    <form className="project-settings__info">
      <section>
        <h2>Info</h2>
        <TextField
          id="projectName"
          label="Project Name"
          name="project[name]"
          onChange={onUpdateHandler}
          placeholder="My project"
          value={project.name} />
        <TextField
          id="projectDescription"
          label="Description (optional)"
          large
          name="project[description]"
          onChange={onUpdateHandler}
          placeholder=""
          value={project.description} />
      </section>
      <section>
        <h2>Privacy</h2>
        <Checkbox
          id="projectPrivacy"
          help={helpText}
          label="Make this project public"
          onChange={onUpdateHandler}
          value="checked"
        />
      </section>
      <button>Save settings</button>
    </form>
  )
}

ProjectSettingsInfoComponent.propTypes = {
  project: PropTypes.object.isRequired,
  onUpdateHandler: PropTypes.func.isRequired
}

export default ProjectSettingsInfoComponent
