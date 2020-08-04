import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { PATH_PROJECT } from 'Shared/constants'
import { ArrowIcon } from 'Components/Icons'

import Spinner from 'Components/Spinner/SpinnerComponent'

function documentLanguage(numberOfDocuments) {
  if (numberOfDocuments === 0) {
    return <p className="small">No documents to export</p>
  }
  return (
    <p className="small" style={{ margin: 0 }}>
      This export includes <b>{numberOfDocuments} document{numberOfDocuments > 1 && <>s</>}</b>
    </p>
  )
}

const ProjectSettingsExportComponent = ({ numberOfDocuments, project, handleExport, exportLoading, exportUrl }) => {
  const downloadFile = (exportUrl) => {
    return () => {
      const anchor = document.createElement('a')
      anchor.href = exportUrl
      anchor.target = '_blank'
      anchor.download = exportUrl.split('/')[3]
      anchor.click()
    }
  }

  const downloadName = exportUrl ? exportUrl.split('/')[4] : null

  const clickHandler = exportUrl ? downloadFile : handleExport

  return (
    <section>
      <Link to={`${PATH_PROJECT}/${project.id}`} className="link link--back">
        <ArrowIcon direction="left" /> Back to project
      </Link>
      <h2>Export your project</h2>
      <p>
        Whether you’re moving data out of Portway, or want to back it up offline, we make it easy.
      </p>
      <p>
        Once you start the export process we will prepare a zip file for you, which includes all of
        your markdown documents, as well as any attachments, such as photos or files. Your custom
        fields will be stored as Markdown front-matter. This makes it easy to move your data anywhere.
      </p>
      {!exportUrl &&
      <div className="btn-group">
        <button className="btn btn--white" disabled={numberOfDocuments === 0} onClick={clickHandler}>
          Start the export...
        </button>
        {exportLoading && <Spinner />}
        {!exportLoading && documentLanguage(numberOfDocuments)}
      </div>
      }
      {exportUrl &&
      <>
        <h2>All set!</h2>
        <button className="btn btn--with-description" onClick={downloadFile(exportUrl)}>
          <>
            Download your project
            <span className="btn-description">{downloadName}</span>
          </>
        </button>
      </>
      }
    </section>
  )
}

ProjectSettingsExportComponent.propTypes = {
  loading: PropTypes.bool,
  numberOfDocuments: PropTypes.number,
  project: PropTypes.object.isRequired,
  handleExport: PropTypes.func.isRequired,
  exportLoading: PropTypes.bool,
  exportUrl: PropTypes.string
}

export default ProjectSettingsExportComponent
