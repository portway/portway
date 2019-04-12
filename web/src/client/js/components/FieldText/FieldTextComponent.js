import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import SimpleMDE from 'simplemde'

import { RemoveIcon } from 'Components/Icons'
import './SimpleMDE.scss'
import './FieldText.scss'

const FieldTextComponent = ({ field, onChange, onDestroy }) => {
  const textRef = useRef()
  // eslint-disable-next-line no-unused-vars
  const [editor, setEditor] = useState(null)
  // Mount the SimpleMDE Editor
  useEffect(() => {
    setEditor(new SimpleMDE({
      autoDownloadFontAwesome: false,
      autofocus: true,
      autosave: {
        enabled: true,
        uniqueId: field.id
      },
      element: textRef.current,
      initialValue: field.value,
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
    }))
  }, [field.id, field.value])
  // On Change
  useEffect(() => {
    if (editor) {
      editor.codemirror.on('change', () => {
        onChange(editor.value())
      })
    }
  })
  return (
    <div className="field field--text">
      <textarea ref={textRef} />
      <button className="btn btn--blank btn--with-circular-icon" onClick={onDestroy}>
        <RemoveIcon />
      </button>
    </div>
  )
}

FieldTextComponent.propTypes = {
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onDestroy: PropTypes.func.isRequired
}

export default FieldTextComponent
