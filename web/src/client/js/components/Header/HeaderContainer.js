import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { PRODUCT_LOGO, PRODUCT_NAME } from 'Shared/constants'
import HeaderComponent from './HeaderComponent'

const brand = {
  logo: PRODUCT_LOGO,
  name: PRODUCT_NAME,
  default: true // if this is our branding
}

function HeaderContainer({ location }) {
  const section = location.pathname.split('/')[1]
  const projectId = section === 'project' ? location.pathname.split('/')[2] : null
  return (
    <HeaderComponent brand={brand} projectId={projectId} section={section} />
  )
}

HeaderContainer.propTypes = {
  location: PropTypes.object.isRequired
}

export default withRouter(HeaderContainer)
