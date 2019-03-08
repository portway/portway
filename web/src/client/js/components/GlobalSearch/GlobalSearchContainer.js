import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import './GlobalSearch.scss'

class GlobalSearchContainer extends React.Component {
  render() {
    return (
      <div className="global-search">
        <input type="search" name="globalSearch" placeholder="Find anything..." />
      </div>
    )
  }
}

GlobalSearchContainer.propTypes = {
  params: PropTypes.object,
  projects: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects
  }
}

export default connect(mapStateToProps)(GlobalSearchContainer)
