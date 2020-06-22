import React from 'react'
import PropTypes from 'prop-types'

import { SUPPORT_EMAIL, SUPPORT_LINK, NETWORK_STATUS } from 'Shared/constants'
import ApplicationContext from '../../contexts/ApplicationContext'
import Logo from '../../../images/logo.svg'

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
        <main className="error-boundary">
          <section>
            <img src={Logo} />
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
        <main className="error-boundary">
          <section>
            <img src={Logo} />
            <h1>Something went wrong!</h1>
            <p>This is likely our fault. Try reloading, or <a href={SUPPORT_LINK}>contact support</a>.</p>
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </section>
        </main>
      )
    }
    return this.props.children
  }
}

ErrorBoundary.contextType = ApplicationContext

ErrorBoundary.propTypes = {
  children: PropTypes.node,
}

export default ErrorBoundary
