import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { connect } from 'react-redux'

import { FIELD_TYPES } from 'Shared/constants'
import { RemoveIcon, SettingsIcon } from 'Components/Icons'
import DocumentUsersComponent from 'Components/DocumentUsers/DocumentUsersComponent'
import { currentUserId } from 'Libs/currentIds'
// import useSyncFieldChange from 'Hooks/useSyncFieldChange'

import './_DocumentField.scss'
import './_DocumentFieldSettings.scss'
import './_DocumentTools.scss'

const DocumentFieldComponent = ({
  children,
  field,
  index,
  isNewField,
  isUpdating,
  onBlur,
  onFocus,
  onChange,
  onRename,
  readOnly,
  settingsHandler,
  settingsMode,
  usersById,
  remoteUserFieldFocus,
  isCurrentlyFocusedField,
  remoteChanges
}) => {
  console.log(remoteChanges)
  const nameRef = useRef()
  const [fieldBody, setFieldBody] = useState(field.value)
  const hasRemoteChanges = remoteChanges && remoteChanges.length

  function handleFieldBodyUpdate(body) {
    // always set the field body
    setFieldBody(field.id, body)

    // no remote changes, update via API.  If there are remote changes, API update will be manually triggered by user
    if (!hasRemoteChanges) {
      onChange(field.id, body)
    }
  }


  // console.log(setFieldBody)
  // console.log
  // const { currentDocumentUserFieldFocus,  } = socketState

  // useSyncFieldChange(field.documentId, (userId, fieldId) => {
  //   // A remote change came through, make sure it's from another user and applicable to this field and update Ref
  //   if (userId !== currentUserId && fieldId === field.id && hasFocusRef.current) {
  //     hasRemoteChangeSinceFocusRef.current = true
  //   }
  // })

  // const onChildFieldBlur = (fieldId, fieldType, editorRef) => {
  //   console.log('has local change', hasLocalChangeSinceFocusRef)
  //   console.log('has remote change', hasRemoteChangeSinceFocusRef)
  //   onBlur(field.id, field.type, editorRef.current)
  //   // Remote and local changes, ask the user if they want to overwrite
  //   if (hasRemoteChangeSinceFocusRef.current && hasLocalChangeSinceFocusRef.current) {
  //     const accept = window.confirm(
  //       'Someone else has made changes to this field, do you want to overwrite their changes?'
  //     )
  //     if (accept) {
  //       onChange(field.id, editorRef.current.getValue())
  //     } else {
  //       setForcedRefresh(Date.now())
  //     }
  //     // No remote changes, just local ones, update via api
  //   } else if (hasLocalChangeSinceFocusRef.current) {
  //     onChange(field.id, editorRef.current.getValue())
  //     // Just remote changes, nothing changed locally, refresh to get remote changes
  //   } else if (!hasLocalChangeSinceFocusRef.current && hasRemoteChangeSinceFocusRef.current) {
  //     setForcedRefresh(Date.now())
  //   }
  //   // Set all these Ref values regardless of whether there were changes
  //   hasFocusRef.current = false
  //   hasLocalChangeSinceFocusRef.current = false
  //   hasRemoteChangeSinceFocusRef.current = false
  // }

  //Relevant usersById should already be fetched by the document users container

  const currentFieldUserIds = Object.keys(remoteUserFieldFocus).reduce((cur, userId) => {
    // user is focused on this field
    if (remoteUserFieldFocus[userId] === field.id && Number(userId) !== currentUserId) {
      return [...cur, userId]
    }
    return cur
  }, [])

  const currentFieldUsers = currentFieldUserIds.reduce((cur, userId) => {
    if (usersById[userId]) {
      return [...cur, usersById[userId]]
    }
    return cur
  }, [])

  useEffect(() => {
    if (isNewField && nameRef.current) {
      nameRef.current.scrollIntoView({ behavior: 'smooth' })
      nameRef.current.focus()
    }
  }, [isNewField])

  const dataField = field.type !== FIELD_TYPES.TEXT && field.type !== FIELD_TYPES.IMAGE

  const fieldClasses = cx({
    'document-field': true,
    'document-field--new': isNewField,
    'document-field--data': dataField,
    'document-field--text': field.type === FIELD_TYPES.TEXT,
    'document-field--number': field.type === FIELD_TYPES.NUMBER,
    'document-field--string': field.type === FIELD_TYPES.STRING,
    'document-field--image': field.type === FIELD_TYPES.IMAGE,
    'document-field--settings-mode': settingsMode,
  })

  const fieldToolClasses = cx({
    'document-field__tools': true,
  })

  const fieldActionClasses = cx({
    'document-field__actions': true,
  })

  const fieldContainerClasses = cx({
    'document-field__container': true,
  })

  const fieldLabels = {
    [FIELD_TYPES.TEXT]: 'Text area',
    [FIELD_TYPES.STRING]: 'String',
    [FIELD_TYPES.NUMBER]: 'Number',
    [FIELD_TYPES.IMAGE]: 'Image',
  }

  // Field name handling
  const fieldLengthFactor = 6.5
  const fieldNameMaxLength = 50
  const fieldMinimumWidth = 150 // this is set as a var in _DocumentField.scss as well
  function returnInitialNameLength(length) {
    if (length > fieldNameMaxLength) {
      return
    }
    return length * fieldLengthFactor > fieldMinimumWidth ? length * fieldLengthFactor : fieldMinimumWidth
  }

  return (
    <li
      className={fieldClasses}
      data-id={field.id}
      data-order={index}
    >
      <div className="document-field__component">

        <div className={fieldToolClasses}>
          <DocumentUsersComponent activeUsers={currentFieldUsers} direction="vertical" mode="field" />
        </div>

        <div>
          {hasRemoteChanges ? <button onClick={() => { onChange(field.id, fieldBody )} }>save</button> : null}
        </div>

        <div className={fieldContainerClasses}>

          {dataField &&
          <div className="document-field__name">
            <span className="document-field__name-label">{fieldLabels[field.type]}</span>
            <input
              defaultValue={field.name}
              maxLength={fieldNameMaxLength}
              onKeyDown={(e) => {
                if (e.key.toLowerCase() === 'escape') {
                  e.target.blur()
                  return
                }
                e.target.style.width = `${returnInitialNameLength(e.target.value.length + 1)}px`
              }}
              onBlur={(e) => { onBlur(field.id, field.type, field) }}
              onChange={(e) => { onRename(field.id, e.target.value) }}
              onFocus={(e) => {
                if (!readOnly) {
                  onFocus(field.id, field.type, field)
                  e.target.select()
                }
              }}
              readOnly={readOnly}
              ref={nameRef}
              style={{ width: returnInitialNameLength(field.name.length) + 'px' }}
              type="text" />
          </div>
          }

          <div className="document-field__content">
            <div className="document-field__settings-button">
              <>
              {field.type === FIELD_TYPES.IMAGE && field.value && !settingsMode && !readOnly &&
                <button aria-label="Field settings" className="btn btn--blank btn--with-circular-icon" onClick={() => { settingsHandler(field.id) }}>
                  <SettingsIcon />
                </button>
              }
              {settingsMode && !readOnly &&
                <button aria-label="Exit settings" className="btn btn--blank btn--with-circular-icon" onClick={() => { settingsHandler(field.id) }}>
                  <RemoveIcon width="32" height="32" />
                </button>
              }
              </>
            </div>
            {React.cloneElement(children, { handleFieldBodyUpdate, fieldId: field.id, fieldBody, isCurrentlyFocusedField })}
          </div>
        </div>

        <div className={fieldActionClasses}></div>

      </div>
    </li>
  )
}

DocumentFieldComponent.propTypes = {
  children: PropTypes.element.isRequired,
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isNewField: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  settingsHandler: PropTypes.func.isRequired,
  settingsMode: PropTypes.bool.isRequired,
  usersById: PropTypes.object,
  currentDocumentUserFieldFocus: PropTypes.object,
  isCurrentlyFocusedField: PropTypes.bool,
  remoteChanges: PropTypes.array
}

const mapStateToProps = (state) => {
  return {
    usersById: state.users.usersById
  }
}

export default connect(mapStateToProps)(DocumentFieldComponent)
