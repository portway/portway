import React from 'react'
import PropTypes from 'prop-types'

import ProjectSettingsTokenList from './ProjectSettingsTokenList'

const ProjectSettingsTokensComponent = ({ tokens }) => {
  return (
    <>
      <section>
        <h2>Manage Keys</h2>
        <ProjectSettingsTokenList tokens={tokens} />
      </section>
      <section>
        <h2>Project Endpoints</h2>
      </section>
    </>
  )
}

ProjectSettingsTokensComponent.propTypes = {
  tokens: PropTypes.array.isRequired
}

export default ProjectSettingsTokensComponent
