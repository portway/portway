import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { fetchProjects } from 'Actions/project'
import NavigatorItemList from './NavigatorItemList'

import './Navigator.scss'

class NavigatorContainer extends React.Component {
  constructor(props) {
    super(props)
    this.nodeRef = React.createRef()
    this.menuRef = React.createRef()
    this.state = {
      expanded: false
    }
  }

  componentDidMount() {
    if (Object.keys(this.props.projects).length === 0) {
      // If we don't have any projects, go get them
      this.props.fetchProjects()
    }
    document.addEventListener('mousedown', this.mouseDownHandler.bind(this), false)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.mouseDownHandler.bind(this), false)
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props
    if (prevProps.match.params.projectId !== match.params.projectId) {
      this.setState({ expanded: false })
    }
  }

  renderTitle() {
    const { match } = this.props
    const section = match.path.split('/')[1]
    return match.params.projectId && section === 'project' ? this.props.project.name : 'Projects'
  }

  render() {
    const { match } = this.props
    const section = match.path.split('/')[1]
    return (
      <div className={`navigator navigator--${section}`} ref={this.nodeRef}>
        <button
          aria-expanded={this.state.expanded}
          aria-haspopup
          onClick={this.expandMenu.bind(this)}>
          <h2 className="navigator__title h-third-level">{this.renderTitle()}</h2>
        </button>
        <div className="navigator__menu" hidden={!this.state.expanded} ref={this.menuRef}>
          <NavigatorItemList items={this.props.projects ? this.props.projects : {}} />
        </div>
      </div>
    )
  }

  expandMenu() {
    this.setState({ expanded: !this.state.expanded }, () => {
      this.menuRef.current.hidden = !this.state.expanded
    })
  }

  mouseDownHandler(e) {
    // Collapse the menu if we've clicked outside
    if (this.state.expanded) {
      if (this.nodeRef && this.nodeRef.current) {
        if (this.nodeRef.current.contains(e.target)) {
          return
        }
        this.expandMenu()
      }
    }
    return
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
