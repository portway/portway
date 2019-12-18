import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { PATH_PROJECTS, SUPPORT_EMAIL } from 'Shared/constants'
import { SearchIcon } from 'Components/Icons'

const FourZeroFour = () => {
  const location = useLocation()
  return (
    <main>
      <section>
        <div className="notice">
          <div className="notice__icon">
            <SearchIcon />
          </div>
          <h2 className="notice__headline">Not found...</h2>
          <p>We couldn’t find anything at “{location.pathname}”.</p>
          <p className="small">Think this is a mistake? <a href={`mailto:${SUPPORT_EMAIL}`}>Contact support</a>.</p>
          <Link to={PATH_PROJECTS} className="btn btn--small notice__action">Return to projects</Link>
        </div>
      </section>
    </main>
  )
}

export default FourZeroFour
