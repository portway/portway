import React from 'react'
import PropTypes from 'prop-types'

import NavigatorItemList from './NavigatorItemList'

import './Navigator.scss'

class NavigatorComponent extends React.Component {
  constructor(props) {
    super(props)
    this.timeOutId = null
    this.nodeRef = React.createRef()
    this.menuRef = React.createRef()
    this.state = {
      expanded: false
    }
  }

  componentDidMount() {
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
    const { match, project } = this.props
    const section = match.path.split('/')[1]
    return match.params.projectId && section === 'project' ? project.name : 'Projects'
  }

  render() {
    const { match, projects } = this.props
    const section = match.path.split('/')[1]
    return (
      <div
        ref={this.nodeRef}
        className={`navigator navigator--${section}`}
        onBlur={this.onBlurHandler.bind(this)}
        onFocus={this.onFocusHandler.bind(this)}>
        <button
          aria-expanded={this.state.expanded}
          aria-haspopup
          aria-label="Select a project"
          onClick={this.expandMenu.bind(this)}>
          <h2 className="navigator__title h-third-level">{this.renderTitle()}</h2>
        </button>
        <div className="navigator__menu" hidden={!this.state.expanded} ref={this.menuRef}>
          <NavigatorItemList items={projects ? projects : {}} />
        </div>
      </div>
    )
  }

  expandMenu() {
    this.setState({ expanded: !this.state.expanded }, () => {
      this.menuRef.current.hidden = !this.state.expanded
    })
  }

  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        expanded: false
      })
    })
  }

  onFocusHandler() {
    clearTimeout(this.timeOutId)
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

NavigatorComponent.propTypes = {
  match: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired
}

export default NavigatorComponent
