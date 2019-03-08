import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { fetchProjects } from 'Actions/project'
import NavigatorComponent from './NavigatorComponent'

class NavigatorContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if (Object.keys(this.props.projects).length === 0) {
      // @todo change this whenever we figure out the API caching thing
      // If we don't have any projects, go get them
      this.props.fetchProjects()
    }
  }

  render() {
    const { match, project, projects } = this.props
    const section = match.path.split('/')[1]
    return (
      <NavigatorComponent section={section} match={match} projects={projects} project={project} />
    )
  }
}

NavigatorContainer.propTypes = {
  match: PropTypes.object.isRequired,
  fetchProjects: PropTypes.func,
  project: PropTypes.object,
  projects: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    project: state.project,
    projects: state.projects
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchProjects }, dispatch)
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NavigatorContainer)
)
