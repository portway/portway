import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import NavigatorItemList from './NavigatorItemList'

import './Navigator.scss'

class NavigatorContainer extends React.Component {
  constructor(props) {
    super(props)
    this.nodeRef = React.createRef()
    this.menuRef = React.createRef()
    this.state = {
      expanded: false,
      title: this.renderTitle()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.section !== this.props.section) {
      this.setState({ title: this.renderTitle() })
    }
    if (prevProps.params.projectId !== this.props.params.projectId) {
      // Update the title and close the menu.
      // We have changed projects.
      this.setState({
        expanded: false,
        title: this.renderTitle()
      })
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.mouseDownHandler.bind(this), false)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.mouseDownHandler.bind(this), false)
  }

  renderTitle() {
    return this.props.section === 'projects' ? 'Projects' : this.getProject().name
  }

  render() {
    return (
      <div className={`navigator navigator--${this.props.section}`} ref={this.nodeRef}>
        <button
          aria-expanded={this.state.expanded}
          aria-haspopup
          onClick={this.expandMenu.bind(this)}>
          <h2 className="navigator__title h-third-level">{this.state.title}</h2>
        </button>
        <div className="navigator__menu" hidden={!this.state.expanded} ref={this.menuRef}>
          <NavigatorItemList items={this.props.projects} />
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
    if (this.nodeRef && this.state.expanded) {
      if (this.nodeRef.current.contains(e.target)) {
        return
      }
      this.expandMenu()
    }
  }

  getProject() {
    return this.props.projects[this.props.params.projectId]
  }
}

NavigatorContainer.propTypes = {
  section: PropTypes.string,
  params: PropTypes.object,
  projects: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects
  }
}

export default connect(mapStateToProps)(NavigatorContainer)
