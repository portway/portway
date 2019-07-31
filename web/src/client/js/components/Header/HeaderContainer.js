import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { PRODUCT_LOGO, PRODUCT_NAME } from 'Shared/constants'
import HeaderComponent from './HeaderComponent'

const brand = {
  logo: PRODUCT_LOGO,
  name: PRODUCT_NAME,
  default: true // if this is our branding
}

function HeaderContainer({ isFullScreen, location }) {
  const section = location.pathname.split('/')[1]
  const projectId = section === 'project' ? location.pathname.split('/')[2] : null
  return (
    <HeaderComponent brand={brand} isFullScreen={isFullScreen} projectId={projectId} section={section} />
  )
}

HeaderContainer.propTypes = {
  isFullScreen: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  return {
    isFullScreen: state.ui.document.isFullScreen
  }
}

export default withRouter(
  connect(mapStateToProps)(HeaderContainer)
)
