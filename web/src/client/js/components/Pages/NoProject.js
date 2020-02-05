import React from 'react'
import { Helmet } from 'react-helmet'

import { PRODUCT_NAME } from 'Shared/constants'

const NoProject = () => {
  return (
    <>
      <Helmet>
        <title>Project not found – {PRODUCT_NAME}</title>
      </Helmet>
      <main>
        <h2>Project not found</h2>
      </main>
    </>
  )
}

export default NoProject
