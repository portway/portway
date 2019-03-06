import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Header from 'Components/Header/Header'
import ProjectsListComponent from 'Components/ProjectsList/ProjectsList'

class DashboardContainer extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header path={this.props.match.path} />
        <div role="main">
          <div className="scroll-container section">
            <h1>Dashboard</h1>
            <ProjectsListComponent projects={this.props.projects} />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

DashboardContainer.propTypes = {
  match: PropTypes.object,
  projects: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects
  }
}

export default connect(mapStateToProps)(DashboardContainer)
