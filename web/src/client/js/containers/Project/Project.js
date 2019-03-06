import React from 'react'
import PropTypes from 'prop-types'

import Header from 'Components/Header/Header'

class ProjectContainer extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header path={this.props.match.path} />
        <div role="main">
          <div className="scroll-container section">
            <h1>Project</h1>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

ProjectContainer.propTypes = {
  match: PropTypes.object,
  projects: PropTypes.object
}

export default ProjectContainer
