import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { PRODUCT_NAME } from 'Shared/constants'

import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'
import HeaderComponent from './HeaderComponent'

import Logo from '../../../images/logo.svg'

function HeaderContainer({ isFullScreen, location }) {
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())

  const brand = {
    logo: currentOrg && currentOrg.avatar ? currentOrg.avatar : Logo,
    name: PRODUCT_NAME,
    default: currentOrg && currentOrg.avatar // if this is our branding
  }
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
