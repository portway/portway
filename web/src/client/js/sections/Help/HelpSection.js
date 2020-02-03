import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'

import { URL_API_DOCS, PRODUCT_NAME, FEEDBACK_EMAIL } from 'Shared/constants'

import './_Help.scss'

const HelpSection = () => {
  useEffect(() => {
    document.querySelector('body').classList.add('body--with-scrolling')
    return function cleanup() {
      document.querySelector('body').classList.remove('body--with-scrolling')
    }
  }, [])

  const feedbackEmail = `mailto:${FEEDBACK_EMAIL}`

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
                Thanks for trying out Portway. We hope you enjoy kicking the tires on our new app.
                If you have anything you’d like to share, please{' '}
                <a target="_blank" rel="noopener noreferrer" href={feedbackEmail}>
                  contact us
                </a>{' '}
                . We’d love to hear your thoughts.
              </p>
              <h2>What is Portway?</h2>
              <p>
                Note apps. They’re simple, quick, and for the more organized amongst us,
                satisfying to categorize. But what do notes look like if you stick an API behind
                them? What about a sprinkling of content management? (We promise, just a
                sprinkling!)
              </p>
              <p>
                We think it looks like Portway. The beauty and simplicity of notes with the power
                of the connected web.
              </p>

              <h2>Your free Team plan</h2>
              <p>
                We’ve given you a free Team plan. Invite your friends and coworkers, create some
                projects, and unleash them wherever you choose via the Portway API. Or use it as a
                private space to organize your team’s thoughts and documents. Or do both!
                We’ll leave that up to you.
              </p>

              <p>
                We’ll continue to push regular updates, so be on the lookout for new features. In
                the meantime,{' '}
                <a rel="noopener noreferrer" target="_blank" href={feedbackEmail}>
                  let us know what you think!
                </a>
              </p>

              <p className="section">
                <b>Thanks again!</b>
                <br />
                Your friends at BonkeyBong ❤️
              </p>
            </div>
            <aside className="help-section__aside">
              <h2>Helpful links</h2>
              <ul className="list list--blank">
                <li>
                  <a href={URL_API_DOCS}>Portway API Docs</a>
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
