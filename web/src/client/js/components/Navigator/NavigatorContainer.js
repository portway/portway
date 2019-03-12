import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'

import NavigatorComponent from './NavigatorComponent'
import useDataService from 'Hooks/useDataService'
import dataMapper from '../../libs/dataMapper'

const NavigatorContainer = ({ match }) => {
  const { data: projects } = useDataService(dataMapper.projects.list())
  // const project = useDataService(dataMapper.project.id(match.params.id))
  const project = null

  return <NavigatorComponent projects={projects} project={project} match={match} />
}

NavigatorContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(NavigatorContainer)

/*
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
*/
