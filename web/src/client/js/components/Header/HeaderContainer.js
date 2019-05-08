import React from 'react'
import Constants from 'Shared/constants'
import Header from './Header'

const brand = {
  logo: Constants.PRODUCT_LOGO,
  name: Constants.PRODUCT_NAME,
  default: true // if this is our branding
}

function HeaderContainer() {
  return (
    <Header brand={brand} />
  )
}

export default HeaderContainer
