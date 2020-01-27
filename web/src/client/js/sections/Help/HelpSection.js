import React from 'react'
import { Helmet } from 'react-helmet'

import { URL_DOCUMENTATION, URL_API, URL_WEBSITE, PRODUCT_NAME } from 'Shared/constants'

import './_Help.scss'

const HelpSection = () => {
  return (
    <>
      <Helmet>
        <title>Help – {PRODUCT_NAME}</title>
      </Helmet>
      <main className="help-section">
        <article className="section">
          <h1>Help</h1>
          <p>
            Thanks for trying out Portway. We hope you enjoy kicking the tires on our new app before
            we launch it publicly. If you find anything wrong, or have an opinion you’d like to share,
            please <a href="mailto:support@portway.app">contact us</a>.
          </p>
          <p>
            <b>Thanks again!</b><br />Your friends at BonkeyBong ❤️
          </p>
          <h2>Helpful links</h2>
          <ul>
            <li><a href={URL_DOCUMENTATION}>Documentation</a></li>
            <li><a href={URL_API}>Portway API</a></li>
            <li><a href={`${URL_WEBSITE}/dirk.html`} target="_blank" rel="noopener noreferrer">Preview of the Portway website</a></li>
          </ul>
        </article>
      </main>
    </>
  )
}

HelpSection.propTypes = {
}

export default HelpSection
