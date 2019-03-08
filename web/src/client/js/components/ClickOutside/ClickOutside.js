import React from 'react'

export const withClickOutside = (WrappedComponent, callback) => {
  return class ClickOutside extends React.Component {
    constructor(props) {
      super(props)
      this.node = React.createRef()
      this.state = {
        hide: false
      }
    }
    componentDidMount() {
      document.addEventListener('mousedown', this.mouseDownHandler.bind(this), false)
    }
    componentWillUnmount() {
      document.removeEventListener('mousedown', this.mouseDownHandler.bind(this), false)
    }
    mouseDownHandler(e) {
      if (this.node.contains(e.target)) {
        return
      }
      this.setState({ hide: true })
    }
    render() {
      return <WrappedComponent hideElement={this.state.hide} {...this.props} />
    }
  }
}
