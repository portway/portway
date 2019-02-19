import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ProjectsListComponent from 'Components/ProjectsList/ProjectsList'

class ProjectsContainer extends React.Component {
  render() {
    return (
      <div>
        <h1>Projects</h1>
        <ProjectsListComponent projects={this.props.projects} />
      </div>
    )
  }
}

ProjectsContainer.propTypes = {
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
