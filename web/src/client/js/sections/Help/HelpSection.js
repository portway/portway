import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'

import {
  URL_API_DOCS,
  URL_GUIDES,
  URL_PRIVACY,
  URL_TWITTER,
  PRODUCT_NAME,
} from 'Shared/constants'

import HelpForm from './HelpForm'
import './_Help.scss'

const HelpSection = () => {
  useEffect(() => {
    document.querySelector('body').classList.add('body--with-scrolling')
    return function cleanup() {
      document.querySelector('body').classList.remove('body--with-scrolling')
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>Help – {PRODUCT_NAME}</title>
      </Helmet>
      <main className="help-section">
        <article className="section">
          <div className="help-section__grid">
            <div className="help-section__content">
              <h2>Contact us</h2>
              <p>
                Have a feature request or having a problem? Let us know, and we will get back to you
                as soon as we can.
              </p>
              <HelpForm />
            </div>
            <aside className="help-section__aside">
              <h2>Documentation</h2>
              <ul className="list list--blank help-section__descriptive-list">
                <li>
                  <p>Learn what you can do with Portway by perusing our handy guides website.</p>
                  <a href={URL_GUIDES} className="btn btn--small btn--white" target="_blank" rel="noopener noreferrer">View the Guides</a>
                </li>
                <li>
                  <p>Develop your own applications, integrations, or shortcuts using the robust Portway API.</p>
                  <a href={URL_API_DOCS} className="btn btn--small btn--white" target="_blank" rel="noopener noreferrer">Read the API docs</a>
                </li>
              </ul>
              <h2>Helpful links</h2>
              <ul className="list list--blank">
                <li>
                  <a href={URL_TWITTER} target="_blank" rel="noopener noreferrer">@portwayapp on Twitter</a>
                </li>
                <li>
                  <a href={URL_PRIVACY} target="_blank" rel="noopener noreferrer">Your privacy</a>
                </li>
              </ul>
            </aside>
          </div>
        </article>
      </main>
    </>
  )
}

HelpSection.propTypes = {
}

export default HelpSection
