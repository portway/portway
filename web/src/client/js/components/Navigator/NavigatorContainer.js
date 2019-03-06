import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import NavigatorItemList from './NavigatorItemList'
import './Navigator.scss'

class NavigatorContainer extends React.Component {
  constructor(props) {
    super(props)
    this.menuRef = React.createRef()
    this.state = {
      expanded: false,
      title: this.renderTitle()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.section !== this.props.section) {
      this.setState({ title: this.props.section === this.renderTitle() })
    }
  }

  renderTitle() {
    return this.props.section === 'projects' ? 'Projects' : 'Project Name'
  }

  render() {
    return (
      <div className={`navigator navigator--${this.props.section}`}>
        <button aria-expanded="false" aria-haspopup onClick={this.expandMenu.bind(this)}>
          <h2 className="navigator__title h-third-level">{this.state.title}</h2>
        </button>
        <div className="navigator__menu" ref={this.menuRef}>
          {this.props.section === 'projects' && <NavigatorItemList items={this.props.projects} />}
        </div>
      </div>
    )
  }

  expandMenu() {
    this.setState({ expanded: !this.state.expanded }, () => {
      this.menuRef.current.hidden = !this.state.expanded
    })
  }
}

NavigatorContainer.propTypes = {
  section: PropTypes.string,
  projects: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects
  }
}

export default connect(mapStateToProps)(NavigatorContainer)
