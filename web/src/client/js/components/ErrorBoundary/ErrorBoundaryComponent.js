import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { SUPPORT_EMAIL, SUPPORT_LINK, NETWORK_STATUS } from 'Shared/constants'
import ApplicationContext from '../../contexts/ApplicationContext'
import './ErrorBoundary.scss'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // @todo if we implement an error log endpoint
    // logErrorToMyService(error, info)
  }

  render() {
    if (this.context.networkStatus === NETWORK_STATUS.OFFLINE && this.state.hasError) {
      return (
        <main>
          <section>
            <h1>You’re offline</h1>
            <p>
              It looks like there’s a problem with your internet connection.
            </p>
          </section>
        </main>
      )
    }
    if (this.state.hasError) {
      return (
        <section className="error-boundary">
          <h1>Something went wrong</h1>
          <p>Try reloading, or contact support.</p>
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> <a href={SUPPORT_LINK}>{SUPPORT_LINK}</a>
        </section>
      )
    }
    return this.props.children
  }
}

ErrorBoundary.contextType = ApplicationContext

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  history: PropTypes.object,
}

export default withRouter(ErrorBoundary)
