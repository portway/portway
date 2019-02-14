import React from 'react'
import SimpleMDE from 'simplemde'

import './EditorComponent.scss'

class EditorComponent extends React.Component {
  constructor(props) {
    super(props)
    this.editorRef = React.createRef()
    this.state = {
      textEditor: null
    }
  }

  componentDidMount() {
    this.setState({
      textEditor: new SimpleMDE({ element: this.editorRef.current })
    })
  }

  render() {
    return (
      <div>
        <textarea ref={this.editorRef} />
      </div>
    )
  }
}

export default EditorComponent
