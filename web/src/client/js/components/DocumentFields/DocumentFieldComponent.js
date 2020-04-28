import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { connect } from 'react-redux'

import { FIELD_TYPES, SYNC_SINGLE_USER_EDIT_FIELDS } from 'Shared/constants'
import { currentUserId } from 'Libs/currentIds'
import usePrevious from 'Hooks/usePrevious'

import DocumentUsersComponent from 'Components/DocumentUsers/DocumentUsersComponent'

import './_DocumentField.scss'
import './_DocumentTools.scss'

// Fields that are of the "data" type in the content menu
// These get the name, and white box around them
const DATA_FIELD_TYPES = [
  FIELD_TYPES.DATE,
  FIELD_TYPES.FILE,
  FIELD_TYPES.NUMBER,
  FIELD_TYPES.STRING,
]

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
  usersById,
  remoteChangesInCurrentlyFocusedField,
  myFocusedFieldId,
  remoteUserFieldFocus
}) => {
  const remoteChangesRef = useRef([])
  const nameRef = useRef()
  const previousField = usePrevious(field)
  const toolsRef = useRef()
  const fieldRef = useRef()

  const [currentValue, setCurrentValue] = useState(field.value)
  const [showConflictPopper, setShowConflictPopper] = useState(false)

  const singleUserEditField = SYNC_SINGLE_USER_EDIT_FIELDS.includes(field.type)
  const isCurrentlyFocusedField = Number(myFocusedFieldId) === field.id
  // Track if a remote user is editing this field
  let isBeingRemotelyEdited

  useEffect(() => {
    // we only care if there are some changes present
    if (!remoteChangesInCurrentlyFocusedField.length) return
    // we're currently focused on this field, collect all the changes that come down the pipeline
    if (isCurrentlyFocusedField) {
      remoteChangesRef.current = remoteChangesInCurrentlyFocusedField
    }
    // if we're not focused on this field, but we're already showing the conflict popper, accept the changes to updated the popper
    if (!isCurrentlyFocusedField && showConflictPopper) {
      remoteChangesRef.current = remoteChangesInCurrentlyFocusedField
    }
  }, [remoteChangesInCurrentlyFocusedField, isCurrentlyFocusedField, showConflictPopper])

  // Can this be a useEffect? Not sure `remoteUserFieldFocus` can be a dependency?
  Object.keys(remoteUserFieldFocus).find((userId) => {
    if (remoteUserFieldFocus[userId] === field.id && Number(userId) !== currentUserId) {
      isBeingRemotelyEdited = true
      return true // satisfy array `find` to stop execution
    }
  })

  // Disable name change if the field is read only, or single user editable and remotely focused
  const shouldLockNameChange = readOnly || (singleUserEditField && isBeingRemotelyEdited)

  useEffect(() => {
    if (remoteChangesRef.current.length > 0 && !singleUserEditField) {
      setShowConflictPopper(true)
    }
  }, [remoteChangesRef.current.length, singleUserEditField])

  useEffect(() => {
    // Accept remote changes to field if it's not focused, the conflict popper isn't open, and the field value has changed
    if (!isCurrentlyFocusedField && !showConflictPopper && previousField !== field && !isUpdating) {
      setCurrentValue(field.value)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field, isUpdating, previousField])

  function handleFieldBodyUpdate(fieldId, body) {
    // Note it is a very bad, no good idea to do anything in this callback beyond pass the change
    // up the chain of callbacks. Any actions performed here that invokes DocumentFieldsContainer
    // regardless of whether they cause a re-render or not will set in motion a chain of devastating
    // events, resulting in a broken debounced onChange that will hit the API until it dies
    // -Dirk 4/2020
    setCurrentValue(body)
    if (!remoteChangesRef.current.length) {
      onChange(fieldId, body)
    }
  }

  function handleDiscard() {
    // reset current value to the remote/redux state,
    // discarding any local changes
    setCurrentValue(field.value)
    setShowConflictPopper(false)
    remoteChangesRef.current = []
    // set the field name to the one in current redux state
    if (nameRef.current) {
      nameRef.current.value = field.name
    }
    // refetch document
    onDiscard(field.documentId)
  }

  function handleManualSave() {
    onChange(field.id, currentValue)
    // there's something different in the name field than there is in the redux state, send those changes
    if (nameRef.current && nameRef.current.value !== field.name) {
      onRename(field.id, nameRef.current.value)
    }
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

  // field name has been updated, set the uncontrolled value
  useEffect(() => {
    if (!isCurrentlyFocusedField && nameRef.current && field.name !== nameRef.current.value && !isUpdating && previousField !== field) {
      nameRef.current.value = field.name
    }
  }, [field, isCurrentlyFocusedField, previousField, isUpdating])

  const dataField = DATA_FIELD_TYPES.includes(field.type)

  const fieldClasses = cx({
    'document-field': true,
    'document-field--new': isNewField,
    'document-field--data': dataField,
    'document-field--text': field.type === FIELD_TYPES.TEXT,
    'document-field--number': field.type === FIELD_TYPES.NUMBER,
    'document-field--string': field.type === FIELD_TYPES.STRING,
    'document-field--image': field.type === FIELD_TYPES.IMAGE,
    'document-field--file': field.type === FIELD_TYPES.FILE,
    'document-field--settings-mode': settingsMode,
    'document-field--is-being-remotely-edited': isBeingRemotelyEdited && singleUserEditField
  })

  const fieldToolClasses = cx({
    'document-field__tools': true
  })

  const fieldActionClasses = cx({
    'document-field__actions': true
  })

  const fieldContainerClasses = cx({
    'document-field__container': true
  })

  const fieldLabels = {
    [FIELD_TYPES.TEXT]: 'Text area',
    [FIELD_TYPES.STRING]: 'String',
    [FIELD_TYPES.NUMBER]: 'Number',
    [FIELD_TYPES.IMAGE]: 'Image',
    [FIELD_TYPES.DATE]: 'Date',
    [FIELD_TYPES.FILE]: 'File'
  }

  return (
    <li className={fieldClasses} data-id={field.id} data-order={index} ref={fieldRef}>
      <div className="document-field__component">
        <div className={fieldToolClasses} ref={toolsRef}>
          <DocumentUsersComponent
            activeUsers={currentFieldUsers}
            direction="vertical"
            mode="field"
          />

          {showConflictPopper &&
          <div className="document-field__changes">
            <div className="document-field__changes-container">
              <div className="document-field__changes-message">
                <span className="document-field__changes-names">
                  {remoteUserChangeNames ? [...remoteUserChangeNames].join(' & ') : 'Someone'}{' '}
                </span>
                {remoteUserChangeNames.length > 1 ? 'have' : 'has'} made changes to this field
              </div>
              <div className="document-field__changes-options">
                <button className="btn btn--like-a-link" onClick={handleManualSave}>
                  Overwrite their changes
                </button>
                <button className="btn btn--like-a-link" onClick={handleDiscard}>
                  Discard your work
                </button>
              </div>
            </div>
          </div>
          }
        </div>

        <div className={fieldContainerClasses}>
          {dataField && (
            <div className="document-field__name">
              <span className="document-field__name-label">{fieldLabels[field.type]}</span>
              <input
                defaultValue={field.name}
                maxLength={50}
                onKeyDown={(e) => {
                  if (e.key.toLowerCase() === 'escape') {
                    e.target.blur()
                    return
                  }
                }}
                onBlur={(e) => {
                  onBlur(field.id, field.type, field.documentId, field)
                }}
                onChange={(e) => {
                  onRename(field.id, e.target.value)
                }}
                onFocus={(e) => {
                  if (!shouldLockNameChange) {
                    onFocus(field.id, field.type, field.documentId, field)
                    e.target.select()
                  }
                }}
                readOnly={shouldLockNameChange}
                ref={nameRef}
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
              isCurrentlyFocusedField,
              isBeingRemotelyEdited,
              documentId: field.documentId
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
  usersById: PropTypes.object,
  remoteChangesInCurrentlyFocusedField: PropTypes.array,
  myFocusedFieldId: PropTypes.number,
  remoteUserFieldFocus: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    usersById: state.users.usersById,
    remoteChangesInCurrentlyFocusedField: state.userSync.remoteChangesInCurrentlyFocusedField,
    myFocusedFieldId: state.documentFields.focused.id,
    remoteUserFieldFocus: state.userSync.remoteUserFieldFocus
  }
}

export default connect(mapStateToProps)(DocumentFieldComponent)
