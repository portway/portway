import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import CodeMirror from 'codemirror/lib/codemirror'

import { currentUserId } from 'Libs/currentIds'
import useSyncFieldChange from 'Hooks/useSyncFieldChange'

import 'codemirror/addon/display/autorefresh'
import 'codemirror/addon/edit/continuelist'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/clike/clike'

import './codemirror.css'
import './FieldText.scss'


window.CodeMirror = CodeMirror

const FieldTextComponent = ({ autoFocusElement, field, onBlur, onChange, onFocus, readOnly }) => {
  const textRef = useRef()
  const editorRef = useRef()
  const hasFocusRef = useRef(false)
  const hasLocalChangeSinceFocusRef = useRef(false)
  const hasRemoteChangeSinceFocusRef = useRef(false)
  const [forcedRefresh, setForcedRefresh] = useState()

  useSyncFieldChange(field.documentId, (userId, fieldId) => {
    // A remote change came through, make sure it's from another user and applicable to this field and update Ref
    if (userId !== currentUserId && fieldId === field.id && hasFocusRef.current) {
      hasRemoteChangeSinceFocusRef.current = true
    }
  })

  // Mount the SimpleMDE Editor
  useEffect(() => {
    editorRef.current = CodeMirror.fromTextArea(textRef.current, {
      addModeClass: true,
      autoRefresh: true,
      dragDrop: false,
      extraKeys: {
        'Enter': 'newlineAndIndentContinueMarkdownList',
        'Tab': 'tabAndIndentMarkdownList',
        'Shift-Tab': 'shiftTabAndUnindentMarkdownList'
      },
      lineNumbers: false,
      lineWrapping: true,
      mode: {
        name: 'gfm',
        gitHubSpice: false,
        highlightFormatting: true,
      },
      scrollbarStyle: null,
      tabSize: 2,
      tokenTypeOverrides: {
        list1: 'formatting-list-ul'
      }
    })
  // We're disabling the dependency warning here because anything other than []
  // causes problems. We only want setEditor to run once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (editorRef.current) {
      function clickURLHandler(e) {
        if (e.target.classList.contains('cm-url')) {
          let url = e.target.textContent
          if (!url.match(/^https?:\/\//i)) {
            url = 'https://' + url
          }
          window.open(url, '_blank', 'noopener')
        }
      }
      const editorDomEl = editorRef.current.display.lineDiv
      editorDomEl.addEventListener('click', clickURLHandler)
      // CodeMirror specific events
      editorRef.current.options.readOnly = readOnly ? 'nocursor' : false

      editorRef.current.on('blur', (cm, e) => {
        console.log('has local change', hasLocalChangeSinceFocusRef)
        console.log('has remote change', hasRemoteChangeSinceFocusRef)
        onBlur(field.id, field.type, editorRef.current)
        // Remote and local changes, ask the user if they want to overwrite
        if (hasRemoteChangeSinceFocusRef.current && hasLocalChangeSinceFocusRef.current) {
          const accept = window.confirm('Someone else has made changes to this field, do you want to overwrite their changes?')       
          if (accept) {
            onChange(field.id, editorRef.current.getValue())
          } else {
            setForcedRefresh(Date.now())
          }
        // No remote changes, just local ones, update via api
        } else if (hasLocalChangeSinceFocusRef.current) {
          onChange(field.id, editorRef.current.getValue())
        // Just remote changes, nothing changed locally, refresh to get remote changes
        } else if (!hasLocalChangeSinceFocusRef.current && hasRemoteChangeSinceFocusRef.current) {
          setForcedRefresh(Date.now())
        }
        // Set all these Ref values regardless of whether there were changes
        hasFocusRef.current = false
        hasLocalChangeSinceFocusRef.current = false
        hasRemoteChangeSinceFocusRef.current = false
      })

      editorRef.current.on('change', (cm, e) => {
        // If there are remote changes, only update via API on blur, not here
        if (e.origin !== 'setValue' && !hasRemoteChangeSinceFocusRef.current) {
          onChange(field.id, editorRef.current.getValue())
          if (hasFocusRef.current) {
            hasLocalChangeSinceFocusRef.current = true
          }
        }
      })
      editorRef.current.on('dragstart', (cm, e) => { e.preventDefault() })
      editorRef.current.on('dragenter', (cm, e) => { e.preventDefault() })
      editorRef.current.on('dragover', (cm, e) => { e.preventDefault() })
      editorRef.current.on('dragleave', (cm, e) => { e.preventDefault() })
      editorRef.current.on('focus', (cm, e) => {
        onFocus(field.id, field.type, editorRef.current)
        hasFocusRef.current = true
        hasLocalChangeSinceFocusRef.current = false
        hasRemoteChangeSinceFocusRef.current = false
      })
      if (autoFocusElement) {
        window.requestAnimationFrame(() => {
          editorRef.current.focus()
        })
      }
    }
  // We're disabling the dependency here because adding field.id or onChange here
  // will cause a bunch of API hits
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef])

  useEffect(() => {
    // We're not focused, we have an editor, and we have a field value, and the field value is different from
    // the editors current value, then we got an update from the socket, so update the text
    if (
      !hasFocusRef.current &&
      editorRef.current &&
      field.value &&
      field.value !== editorRef.current.getValue()
    ) {
      editorRef.current.getDoc().setValue(field.value)
      editorRef.current.refresh()
    }
  }, [field.value, forcedRefresh])

  return (
    <div className="document-field__text">
      <textarea ref={textRef} defaultValue={field.value} readOnly={readOnly} />
    </div>
  )
}

FieldTextComponent.propTypes = {
  autoFocusElement: PropTypes.bool,
  field: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
}

export default FieldTextComponent
