import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import SimpleMDE from 'simplemde'

import { debounce } from 'Shared/utilities'
import './SimpleMDE.scss'
import './FieldText.scss'

const FieldTextComponent = ({ field, onChange }) => {
  const textRef = useRef()
  const [editor, setEditor] = useState(null)
  // Mount the SimpleMDE Editor
  useEffect(() => {
    setEditor(new SimpleMDE({
      autoDownloadFontAwesome: false,
      autofocus: true,
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
      // On Change
      const debouncedChangeHandler = debounce(1000, () => {
        onChange(field ? field.id : -1, editor.value())
      })
      editor.codemirror.on('change', debouncedChangeHandler)
    }
  // We're disavling the dependency here because adding field.id or onChange here
  // will cause a bunch of API hits
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])
  return (
    <textarea ref={textRef} />
  )
}

FieldTextComponent.propTypes = {
  field: PropTypes.object,
  onChange: PropTypes.func.isRequired
}

export default FieldTextComponent
