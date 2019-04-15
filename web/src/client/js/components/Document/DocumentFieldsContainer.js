import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Constants from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { createField, updateField } from 'Actions/field'
import { uiFieldCreate, uiFieldModeChange } from 'Actions/ui'

import { AddIcon } from 'Components/Icons'
import FieldTextComponent from 'Components/FieldText/FieldTextComponent'

const DocumentFieldsContainer = ({ match, createField, updateField, ui, uiFieldCreate, uiFieldModeChange }) => {
  const { documentId } = match.params
  const uiState = ui.fields
  const { data: fields } = useDataService(dataMapper.fields.list(match.params.documentId), [match.params.documentId])
  if (!fields) return null

  function fieldCreateHandler(fieldType) {
    uiFieldCreate(fieldType)
  }
  function fieldAddModeHandler() {
    uiFieldModeChange(!uiState.creating)
  }
  function fieldDestroyHandler(e) {
  }
  function fieldChangeHandler(fieldId, value) {
    // left this console in to make sure we're not hammering the API because of useEffect
    console.info(`Field: ${fieldId} trigger changeHandler`)
    updateField(documentId, fieldId, {
      docId: documentId,
      id: fieldId,
      value: value
    })
  }
  function renderCreateNewFieldWithName() {
    return (
      <div className="document__field-create-input">
        <label htmlFor="create-field-name">First, name your field</label>
        <input
          type="text"
          name="create-field-name"
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'enter') {
              createField(documentId, {
                docId: documentId,
                name: e.target.value,
                type: uiState.type,
                value: ''
              })
            }
          }} />
      </div>
    )
  }
  const fieldMap = Object.keys(fields).map((fieldId) => {
    const field = fields[fieldId]
    switch (field.type) {
      case Constants.FIELD_TYPES.STRING: {
        return <span key={field.id}>String!</span>
      }
      case Constants.FIELD_TYPES.TEXT: {
        return <FieldTextComponent key={field.id} field={field} onChange={fieldChangeHandler} onDestroy={fieldDestroyHandler} />
      }
      case Constants.FIELD_TYPES.NUMBER: {
        return <span key={field.id}>Number!</span>
      }
    }
  })
  return (
    <>
      <div className="document__fields">
        {fieldMap}
        {uiState.creating && uiState.type !== -1 &&
        renderCreateNewFieldWithName()
        }
      </div>
      <footer className="document__footer">
        <button className="btn btn--blank btn--with-circular-icon"
          aria-label="Add a field"
          aria-haspopup
          aria-expanded={uiState.creating}
          title="Add a field"
          onClick={fieldAddModeHandler}>
          <div>
            <AddIcon width="18" height="18" />
          </div>
        </button>
        {uiState.creating &&
        <div className="document__field-menu">
          <ul>
            <li><button className="btn btn--blank" onClick={() => { fieldCreateHandler(Constants.FIELD_TYPES.TEXT) }}>Text area</button></li>
            <li><button className="btn btn--blank"onClick={() => { fieldCreateHandler(Constants.FIELD_TYPES.STRING) }}>Text field</button></li>
            <li><button className="btn btn--blank" onClick={() => { fieldCreateHandler(Constants.FIELD_TYPES.NUMBER) }}>Number</button></li>
          </ul>
        </div>
        }
      </footer>
    </>
  )
}

DocumentFieldsContainer.propTypes = {
  match: PropTypes.object.isRequired,
  createField: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  ui: PropTypes.object.isRequired,
  uiFieldCreate: PropTypes.func.isRequired,
  uiFieldModeChange: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    ui: state.ui
  }
}

const mapDispatchToProps = { createField, updateField, uiFieldCreate, uiFieldModeChange }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentFieldsContainer)
)
