import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import Constants from 'Shared/constants'
import Store from '../../reducers'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { updateField } from 'Actions/field'
import FieldTextComponent from 'Components/FieldText/FieldTextComponent'

const DocumentFieldsContainer = ({ match }) => {
  const { documentId } = match.params
  const { data: fields } = useDataService(dataMapper.fields.list(match.params.documentId), [match.params.documentId])
  if (!fields) return null

  function fieldDestroyHandler(e) {
  }
  function fieldChangeHandler(fieldId, value) {
    // left this console in to make sure we're not hammering the API because of useEffect
    console.info(`Field: ${fieldId} trigger changeHandler`)
    Store.dispatch(updateField(documentId, fieldId, {
      value: value
    }))
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
    <div className="document-fields">
      {fieldMap}
    </div>
  )
}

DocumentFieldsContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(DocumentFieldsContainer)
