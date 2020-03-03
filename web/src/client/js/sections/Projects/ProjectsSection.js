import React, { useEffect } from 'react'

import DashboardContainer from 'Components/Dashboard/DashboardContainer'

const ProjectsContainer = () => {
  useEffect(() => {
    document.querySelector('body').classList.add('body--with-scrolling')
    return function cleanup() {
      document.querySelector('body').classList.remove('body--with-scrolling')
    }
  }, [])
  return (
    <main>
      <DashboardContainer />
    </main>
  )
}

export default ProjectsContainer
