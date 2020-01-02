import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import EasyMDE from 'easymde'

import './EasyMDE.scss'
import './FieldText.scss'

const FieldTextComponent = ({ autoFocusElement, field, onBlur, onChange, onFocus }) => {
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
        drawImage: null,
        toggleFullScreen: null,
        toggleHeadingSmaller: null,
        togglePreview: null,
        toggleSideBySide: null,
        toggleUnorderedList: null,
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
      editor.codemirror.on('blur', (cm, e) => { onBlur(field.id, field.type, editor) })
      editor.codemirror.on('change', () => { onChange(field.id, editor.value()) })
      editor.codemirror.on('dragstart', (cm, e) => { e.preventDefault() })
      editor.codemirror.on('dragenter', (cm, e) => { e.preventDefault() })
      editor.codemirror.on('dragover', (cm, e) => { e.preventDefault() })
      editor.codemirror.on('dragleave', (cm, e) => { e.preventDefault() })
      editor.codemirror.on('focus', (cm, e) => { onFocus(field.id, field.type, editor) })
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
      <textarea ref={textRef} defaultValue={field.value} />
    </div>
  )
}

FieldTextComponent.propTypes = {
  autoFocusElement: PropTypes.number,
  field: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
}

export default FieldTextComponent
