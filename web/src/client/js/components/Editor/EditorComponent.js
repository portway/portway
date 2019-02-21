import React from 'react'
import SimpleMDE from 'simplemde'
import { uniqueId } from 'lodash'

import './SimpleMDE.scss'
import './EditorComponent.scss'

class EditorComponent extends React.Component {
  constructor(props) {
    super(props)
    this.editorRef = React.createRef()
    this.state = {
      textEditor: null,
      uniqueId: uniqueId(Date.now())
    }
  }

  componentDidMount() {
    this.setState({
      // SimpleMDE is a Markdown textarea editor, with previewing and all that
      // https://github.com/sparksuite/simplemde-markdown-editor
      textEditor: new SimpleMDE({
        autoDownloadFontAwesome: false,
        autofocus: true,
        autosave: {
          enabled: true,
          uniqueId: this.state.uniqueId
        },
        element: this.editorRef.current,
        placeholder: 'Your ideas here...',
        shortcuts: {
          toggleHeadingSmaller: null,
          toggleUnorderedList: null,
          togglePreview: null,
          toggleSideBySide: null,
          toggleFullScreen: null
        },
        status: false,
        toolbar: false
      })
    })
  }

  render() {
    return (
      <div className="editor-text">
        <textarea ref={this.editorRef} />
      </div>
    )
  }
}

export default EditorComponent
