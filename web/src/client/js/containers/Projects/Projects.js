import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Header from 'Components/Header/Header'
import ProjectsListComponent from 'Components/ProjectsList/ProjectsList'

class ProjectsContainer extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header path={this.props.match.path} />
        <div role="main">
          <ProjectsListComponent projects={this.props.projects} />
        </div>
      </React.Fragment>
    )
  }
}

ProjectsContainer.propTypes = {
  match: PropTypes.object,
  projects: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onSomeFunction: (id) => {
//       dispatch(someAction(id))
//     }
//   }
// }

export default connect(mapStateToProps)(ProjectsContainer)
