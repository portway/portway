import React from 'react'
import PropTypes from 'prop-types'
import { Link, useParams } from 'react-router-dom'

import { PATH_PROJECT, PROJECT_ROLE_IDS } from 'Shared/constants'
import ProjectPermission from 'Components/Permission/ProjectPermission'
import DocumentOutlineItem from './DocumentOutlineItem'
import './_DocumentOutline.scss'

const DocumentOutlineComponent = ({
  dragEndHandler,
  dragEnterHandler,
  dragLeaveHandler,
  dragStartHandler,
  dropHandler,
  fields,
  fieldsUpdating,
  fieldDestroyHandler,
  fieldRenameHandler,
  fieldSettingToggleHandler,
}) => {
  const { projectId } = useParams()
  return (
    <div className="document-outline">
      <ol className="document-outline__list" onDrop={dropHandler}>
        <p>Drag and drop to reorder your document, or remove fields altogether</p>
        <ProjectPermission acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN]}>
          <p className="document-outline__description note">Name your fields for use in <Link to={`${PATH_PROJECT}/${projectId}/settings/keys`}>the API</Link></p>
        </ProjectPermission>
        {fields.map((field, index) => {
          return (
            <DocumentOutlineItem
              dragEndHandler={dragEndHandler}
              dragEnterHandler={dragEnterHandler}
              dragLeaveHandler={dragLeaveHandler}
              dragStartHandler={dragStartHandler}
              dropHandler={dropHandler}
              field={field}
              fieldSettingToggleHandler={() => { fieldSettingToggleHandler(field.id) }}
              index={index}
              isUpdating={fieldsUpdating[field.id]}
              key={field.id}
              onDestroy={() => { fieldDestroyHandler(field.id, field.type) }}
              onRename={fieldRenameHandler}
            />
          )
        })}
      </ol>
    </div>
  )
}

DocumentOutlineComponent.propTypes = {
  dragEndHandler: PropTypes.func.isRequired,
  dragEnterHandler: PropTypes.func.isRequired,
  dragLeaveHandler: PropTypes.func.isRequired,
  dragStartHandler: PropTypes.func.isRequired,
  dropHandler: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  fieldsUpdating: PropTypes.object,
  fieldDestroyHandler: PropTypes.func.isRequired,
  fieldRenameHandler: PropTypes.func.isRequired,
  fieldSettingToggleHandler: PropTypes.func.isRequired,
}

export default DocumentOutlineComponent
