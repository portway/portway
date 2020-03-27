import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { connect } from 'react-redux'

import { FIELD_TYPES } from 'Shared/constants'
import { RemoveIcon, SettingsIcon } from 'Components/Icons'
import { currentUserId } from 'Libs/currentIds'

import useDocumentSocket from 'Hooks/useDocumentSocket'
import DocumentUsersComponent from 'Components/DocumentUsers/DocumentUsersComponent'
import { Popper } from 'Components/Popper/Popper'

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
  onDiscard,
  readOnly,
  settingsHandler,
  settingsMode,
  usersById
}) => {
  const { state: socketState } = useDocumentSocket()
  const {
    remoteChangesInCurrentlyFocusedField,
    myFocusedFieldId,
    remoteUserFieldFocus
  } = socketState
  const remoteChangesRef = useRef()
  remoteChangesRef.current = myFocusedFieldId === field.id ? remoteChangesInCurrentlyFocusedField : remoteChangesRef.current || []

  const nameRef = useRef()
  const toolsRef = useRef()
  const [cachedLocalChanges, setCachedLocalChanges] = useState()

  function handleFieldBodyUpdate(fieldId, body) {
    // set the unsaved state if applicable
    if (!remoteChangesRef.current.length) {
      onChange(fieldId, body)
    } else {
      setCachedLocalChanges(body)
    }
  }

  function handleDiscard() {
    // refetch document
    onDiscard(field.documentId)
    // clear out any local changes
    setCachedLocalChanges(null)
    remoteChangesRef.current = []
  }

  function handleManualSave() {
    onChange(field.id, cachedLocalChanges)
    setCachedLocalChanges(null)
    remoteChangesRef.current = []
  }

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

  const remoteUserChangeNames = new Set()

  if (remoteChangesRef.current.length) {
    remoteChangesRef.current.forEach((remoteChange) => {
      const { userId } = remoteChange
      const user = usersById[userId]
      if (user) {
        remoteUserChangeNames.add(user.name)
      }
    })
  }

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
    [FIELD_TYPES.DATE]: 'Date',
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

        <div className={fieldToolClasses} ref={toolsRef}>
          <DocumentUsersComponent activeUsers={currentFieldUsers} direction="vertical" mode="field" />
          <Popper align="left" anchorRef={toolsRef} open={Boolean(cachedLocalChanges)} placement="top" width="400">
            <div className="document-field__focus-buttons">
              <div>{remoteUserChangeNames ? [...remoteUserChangeNames].join(' & ') : 'Someone'} {remoteUserChangeNames.length > 1 ? 'have' : 'has'} made changes to this field</div>
              <div className="document-field__focus-button-group">
                <button className="btn btn--white btn--small" onClick={handleManualSave}>Overwrite their changes</button>
                <button className="btn btn--small" onClick={handleDiscard}>Discard your work</button>
              </div>
            </div>
          </Popper>
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
            {React.cloneElement(children, {
              onChange: handleFieldBodyUpdate,
              isCurrentlyFocusedField: Number(myFocusedFieldId) === field.id
            })}
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
  onDiscard: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  settingsHandler: PropTypes.func.isRequired,
  settingsMode: PropTypes.bool.isRequired,
  usersById: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    usersById: state.users.usersById
  }
}

export default connect(mapStateToProps)(DocumentFieldComponent)
