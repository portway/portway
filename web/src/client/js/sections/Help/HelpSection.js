import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'

import { URL_DOCUMENTATION, URL_API, URL_WEBSITE, PRODUCT_NAME } from 'Shared/constants'

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
          <header className="header">
            <h1>Help</h1>
            <span className="pill pill--blue">Preview</span>
          </header>
          <div className="help-section__grid">
            <div className="help-section__content">
              <p>
                Thanks for trying out Portway. We hope you enjoy kicking the tires on our new app before
                we launch it publicly. If you have anything you’d like to share, please <a href="mailto:support@portway.app">contact us</a>.
                We’d love to hear about your experience.
              </p>
              <h2>What is this thing?</h2>
              <p>
                Portway is a notes app, with a focus on <a href="https://en.wikipedia.org/wiki/Markdown" target="_blank">Markdown</a>.
                We built this for the notes app nerd who wants to automate things with Shortcuts.
                We built this for the teams who want a central content repository for their projects.
                Mainly, we built it for us. We’re always building apps for clients and really, really
                dislike content management systems.<br />Think Github for content.
              </p>
              <p>
                We’ve given you a free Team plan. Invite whoever you’d like, create some projects,
                make some documents, and see what you can do with them with the Portway API. We’ve got
                more work to do, but figured it was time to get some friends in here to play.
              </p>
              <p className="section">
                <b>Thanks again!</b><br />Your friends at BonkeyBong ❤️
              </p>
            </div>
            <aside className="help-section__aside">
              <h2>Helpful links</h2>
              <ul className="list list--blank">
                <li><a href={URL_DOCUMENTATION}>Documentation</a></li>
                <li><a href={URL_API}>Portway API</a></li>
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
