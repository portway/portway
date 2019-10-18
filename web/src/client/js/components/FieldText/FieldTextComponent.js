import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import EasyMDE from 'easymde'

import './EasyMDE.scss'
import './FieldText.scss'

const FieldTextComponent = ({ field, onChange, autoFocusElement }) => {
  const textRef = useRef()
  const [editor, setEditor] = useState(null)
  // Mount the SimpleMDE Editor
  useEffect(() => {
    setEditor(new EasyMDE({
      autoDownloadFontAwesome: false,
      autofocus: false,
      autosave: {
        enabled: false
      },
      element: textRef.current,
      initialValue: field ? field.value : '',
      placeholder: 'Your ideas here...',
      shortcuts: {
        toggleHeadingSmaller: null,
        toggleUnorderedList: null,
        togglePreview: null,
        toggleSideBySide: null,
        toggleFullScreen: null
      },
      spellChecker: false,
      status: false,
      toolbar: false
    }))
  // We're disabling the dependency warning here because anything other than []
  // causes problems. We only want setEditor to run once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (editor) {
      editor.codemirror.on('change', () => { onChange(field.id, editor.value()) })
      editor.codemirror.on('dragover', (cm, e) => { e.preventDefault() })
      if (field.id === autoFocusElement) {
        editor.codemirror.focus()
        editor.codemirror.setCursor(editor.codemirror.lineCount(), 0)
      }
    }
  // We're disabling the dependency here because adding field.id or onChange here
  // will cause a bunch of API hits
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])
  return (
    <div className="document-field__text">
      <textarea ref={textRef} />
    </div>
  )
}

FieldTextComponent.propTypes = {
  autoFocusElement: PropTypes.number,
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default FieldTextComponent
