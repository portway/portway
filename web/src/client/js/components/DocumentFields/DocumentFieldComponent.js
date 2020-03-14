import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { connect } from 'react-redux'

import { FIELD_TYPES } from 'Shared/constants'
import { RemoveIcon, SettingsIcon } from 'Components/Icons'
import DocumentUsersComponent from 'Components/DocumentUsers/DocumentUsersComponent'
import { currentUserId } from 'Libs/currentIds'
import useDocumentSocket from 'Hooks/useDocumentSocket'

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

  const isCurrentlyFocusedField = myFocusedFieldId === field.id
  const hasRemoteChanges = isCurrentlyFocusedField && remoteChangesInCurrentlyFocusedField.length

  // console.log(remoteChanges)
  const nameRef = useRef()
  // // set the field body from redux state on initial load
  const fieldBodyRef = useRef(field.value)
  // const hasRemoteChangesRef = useRef(remoteChanges.length > 0)

  // useEffect(() => {
  //   hasRemoteChangesRef.current = remoteChanges.length > 0
  // }, [remoteChanges.length])

  // we're not focused, always set the field body from passed in field prop
  if (!isCurrentlyFocusedField) {
    fieldBodyRef.current = field.value
  }

  function handleFieldBodyUpdate(body) {
    // always set the field body
    fieldBodyRef.current = body
    // no remote changes, update via API.  If there are remote changes, API update will be manually triggered by user
    if (!hasRemoteChanges) {
      onChange(field.id, body)
    }
  }

  function handleDiscard() {
    console.log('dicarding')
    // onDiscard(field.documentId)
  }

  function handleManualSave() {
    console.log('handle manual Save')
    // onChange(field.id, fieldBodyRef.current)
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

  if (hasRemoteChanges) {
    remoteChangesInCurrentlyFocusedField.forEach((set, remoteChange) => {
      const { userId } = remoteChange
      const user = usersById[userId]
      if (user) {
        remoteUserChangeNames.add(user.name)
      }
      return set
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

  const fieldChangeButtonClasses = cx({
    'document-field__focus-buttons': true,
    'document-field__focus-buttons--active': hasRemoteChanges
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
          <div className={fieldChangeButtonClasses}>
            <div>{remoteUserChangeNames || 'Someone'} has made changes to this field</div>
            <button onClick={handleManualSave}>Overwrite their changes</button>
            <button onClick={handleDiscard}>Discard your work</button>
          </div>
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
            {React.cloneElement(children, { handleFieldBodyUpdate, fieldId: field.id, fieldBody: fieldBodyRef.current, isCurrentlyFocusedField })}
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
