import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import { fetchProject } from 'Actions/project'

class ProjectContainer extends React.Component {
  componentDidMount() {
    this.props.fetchProject(this.props.match.params.projectId)
  }

  componentDidUpdate(prevProps) {
    const { match, fetchProject } = this.props
    if (prevProps.match.params.projectId !== match.params.projectId) {
      fetchProject(match.params.projectId)
    }
  }

  render() {
    return <div className="project">{this.props.project.name}</div>
  }
}

ProjectContainer.propTypes = {
  match: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    project: state.project
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchProject }, dispatch)
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProjectContainer)
)
