import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ProjectsListComponent from 'Components/ProjectsList/ProjectsList'
import BillingContainer from 'Components/Billing/BillingContainer'

class DashboardContainer extends React.Component {
  render() {
    return (
      <div role="main">
        <div className="scroll-container section">
          <h1>Dashboard</h1>
          <ProjectsListComponent projects={this.props.projects} />
          <p>This is a test to see if we can mount the billing component anywhere</p>
          <BillingContainer />
        </div>
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
