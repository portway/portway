import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ProjectsListComponent from 'Components/ProjectsList/ProjectsList'

class DashboardContainer extends React.Component {
  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <ProjectsListComponent projects={this.props.projects} />
      </div>
    )
  }
}

DashboardContainer.propTypes = {
  projects: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects
  }
}

export default connect(mapStateToProps)(DashboardContainer)
