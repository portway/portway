import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ProjectsListComponent from 'Components/ProjectsList/ProjectsList'

class ProjectsContainer extends React.Component {
  render() {
    return (
      <div role="main">
        <div className="scroll-container section">
          <div className="container">
            <div className="level">
              <div className="level-left">
                <h1 className="title">Projects</h1>
              </div>
              <div className="level-right">
                <div className="field has-addons">
                  <div className="control">
                    <input className="input" type="text" placeholder="Find a project or document" />
                  </div>
                  <div className="control">
                    <a className="button is-info">Search</a>
                  </div>
                </div>
              </div>
            </div>
            <ProjectsListComponent projects={this.props.projects} />
          </div>
        </div>
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
