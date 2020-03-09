import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'

import { PRODUCT_NAME, TITLE_PROJECTS } from 'Shared/constants'
import DashboardContainer from 'Components/Dashboard/DashboardContainer'

const ProjectsContainer = () => {
  useEffect(() => {
    document.querySelector('body').classList.add('body--with-scrolling')
    return function cleanup() {
      document.querySelector('body').classList.remove('body--with-scrolling')
    }
  }, [])
  return (
    <>
      <Helmet>
        <title>{TITLE_PROJECTS} –– {PRODUCT_NAME}</title>
      </Helmet>
      <main>
        <DashboardContainer />
      </main>
    </>
  )
}

export default ProjectsContainer
