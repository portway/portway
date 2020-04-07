import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { connect } from 'react-redux'

import { FIELD_TYPES, SYNC_SINGLE_USER_EDIT_FIELDS } from 'Shared/constants'
import { debounce } from 'Shared/utilities'
import { currentUserId } from 'Libs/currentIds'

import useDocumentSocket from 'Hooks/useDocumentSocket'
import { emitFieldFocus } from '../../sockets/SocketProvider'
import DocumentUsersComponent from 'Components/DocumentUsers/DocumentUsersComponent'
import { Popper } from 'Components/Popper/Popper'

import './_DocumentField.scss'
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
  settingsMode,
  usersById
}) => {
  const { state: socketState, dispatch: socketDispatch } = useDocumentSocket()
  const {
    remoteChangesInCurrentlyFocusedField,
    myFocusedFieldId,
    remoteUserFieldFocus
  } = socketState
  const remoteChangesRef = useRef()
  const nameRef = useRef()
  const toolsRef = useRef()
  const [currentValue, setCurrentValue] = useState(field.value)
  const [showConflictPopper, setShowConflictPopper] = useState(false)

  const singleUserEditField = SYNC_SINGLE_USER_EDIT_FIELDS.includes(field.type)

  // Track if field should be readOnly based on props + sync state
  let readOnlyField = readOnly

  remoteChangesRef.current =
    myFocusedFieldId === field.id
      ? remoteChangesInCurrentlyFocusedField
      : remoteChangesRef.current || []

  // Can this be a useEffect? Not sure `remoteUserFieldFocus` can be a dependency?
  if (singleUserEditField) {
    // Disable the field if it's single user editable and remotely focused
    Object.keys(remoteUserFieldFocus).find((userId) => {
      if (remoteUserFieldFocus[userId] === field.id && Number(userId) !== currentUserId) {
        readOnlyField = true
        return true // satisfy array `find` to stop execution
      }
    })
  }

  useEffect(() => {
    if (remoteChangesRef.current.length > 0 && !singleUserEditField) {
      setShowConflictPopper(true)
    }
  }, [remoteChangesRef.current.length, singleUserEditField])

  useEffect(() => {
    // Accept remote changes to field if it's not focused and the conflict popper isn't open
    if (myFocusedFieldId !== field.id && !showConflictPopper) {
      setCurrentValue(field.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.id, field.value])


  const sendDebouncedFocusMessage = debounce(500, (fieldId, documentId) => {
    socketDispatch(emitFieldFocus(socketDispatch, fieldId, documentId))
  })

  function handleFieldBodyUpdate(fieldId, body) {
    setCurrentValue(body)
    if (!remoteChangesRef.current.length) {
      onChange(fieldId, body)
    }
    // always update the field focus when a user makes a change, debounced so we don't slam the sync service
    sendDebouncedFocusMessage(fieldId, field.documentId)
  }

  function handleDiscard() {
    // reset current value to the remote/redux state,
    // discarding any local changes
    setCurrentValue(field.value)
    setShowConflictPopper(false)
    remoteChangesRef.current = []
    // refetch document
    onDiscard(field.documentId)
  }

  function handleManualSave() {
    onChange(field.id, currentValue)
    setShowConflictPopper(false)
    remoteChangesRef.current = []
  }

  const currentFieldUserIds = Object.keys(remoteUserFieldFocus).reduce((cur, userId) => {
    // user is focused on this field
    if (remoteUserFieldFocus[userId] === field.id && Number(userId) !== currentUserId) {
      return [...cur, userId]
    }
    return cur
  }, [])

  const currentFieldUsers = currentFieldUserIds.reduce((cur, userId) => {
    //Relevant usersById should already be fetched by the document users container
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
    <li className={fieldClasses} data-id={field.id} data-order={index}>
      <div className="document-field__component">
        <div className={fieldToolClasses} ref={toolsRef}>
          <DocumentUsersComponent
            activeUsers={currentFieldUsers}
            direction="vertical"
            mode="field"
          />
          <Popper
            align="left"
            anchorRef={toolsRef}
            open={showConflictPopper}
            placement="top"
            width="400">
            <div className="document-field__focus-buttons">
              <div>
                {remoteUserChangeNames ? [...remoteUserChangeNames].join(' & ') : 'Someone'}{' '}
                {remoteUserChangeNames.length > 1 ? 'have' : 'has'} made changes to this field
              </div>
              <div className="document-field__focus-button-group">
                <button className="btn btn--white btn--small" onClick={handleManualSave}>
                  Overwrite their changes
                </button>
                <button className="btn btn--small" onClick={handleDiscard}>
                  Discard your work
                </button>
              </div>
            </div>
          </Popper>
        </div>

        <div className={fieldContainerClasses}>
          {dataField && (
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
                onBlur={(e) => {
                  onBlur(field.id, field.type, field)
                }}
                onChange={(e) => {
                  onRename(field.id, e.target.value)
                }}
                onFocus={(e) => {
                  if (!readOnlyField) {
                    onFocus(field.id, field.type, field)
                    e.target.select()
                  }
                }}
                readOnly={readOnlyField}
                ref={nameRef}
                style={{ width: returnInitialNameLength(field.name.length) + 'px' }}
                type="text"
              />
            </div>
          )}

          <div className="document-field__content">
            {React.cloneElement(children, {
              id: field.id,
              type: field.type,
              value: currentValue,
              onChange: handleFieldBodyUpdate,
              isCurrentlyFocusedField: Number(myFocusedFieldId) === field.id
            })}
          </div>
        </div>

        <div className={fieldActionClasses} />
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
  settingsMode: PropTypes.bool.isRequired,
  usersById: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    usersById: state.users.usersById
  }
}

export default connect(mapStateToProps)(DocumentFieldComponent)
