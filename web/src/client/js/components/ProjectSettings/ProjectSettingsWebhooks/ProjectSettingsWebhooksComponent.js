import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { PATH_PROJECT, URL_GUIDES } from 'Shared/constants'
import { ArrowIcon } from 'Components/Icons'

import ProjectSettingsWebhooksList from './ProjectSettingsWebhooksList'
import ProjectSettingsCreateWebhook from './ProjectSettingsCreateWebhook'

import './_ProjectSettingsWebhooks.scss'

const ProjectSettingsWebhooksComponent = ({
  createHandler,
  deliveries,
  deliveriesLoading,
  formId,
  project,
  recentDeliveries,
  removeHandler,
  updateHandler,
  selectedHookId,
  webhooks,
  webhooksLoading
}) => {
  return (
    <>
      <section>
        <Link to={`${PATH_PROJECT}/${project.id}`} className="link link--back">
          <ArrowIcon direction="left" /> Back to project
        </Link>
        <h2>Webhooks</h2>
        <p>
          Use webhooks to work with external services such as&nbsp;
          <a href="https://ifttt.com/" target="_blank" rel="noreferrer noopener">IFTTT</a>,&nbsp;
          <a href="https://zapier.com/" target="_blank" rel="noreferrer noopener">Zapier</a>, or&nbsp;
          <a href="https://www.gatsbyjs.com/" target="_blank" rel="noreferrer noopener">Gatsby</a>.
          Each time you publish a document in this project, we will trigger a webhook to the
          endpoints of your choosing.
        </p>
        <p>Need some ideas? Check out our <a href={URL_GUIDES} target="_blank" rel="noopener noreferrer">Portway guides</a></p>
      </section>
      <section>
        <header className="header">
          <h3>Endpoints</h3>
        </header>
        <div className="project-settings__webhooks">
          <ProjectSettingsCreateWebhook
            formId={formId}
            submitHandler={createHandler}
          />
          {webhooks.length > 0 &&
          <ProjectSettingsWebhooksList
            projectId={project.id}
            deliveries={deliveries}
            deliveriesLoading={deliveriesLoading}
            recentDeliveries={recentDeliveries}
            removeHandler={removeHandler}
            updateHandler={updateHandler}
            selectedHookId={selectedHookId}
            webhooks={webhooks}
          />
          }
          {webhooks.length === 0 &&
          <p className="note">Create your first webhook by adding an endpoint.</p>
          }
        </div>
      </section>
    </>
  )
}

ProjectSettingsWebhooksComponent.propTypes = {
  deliveries: PropTypes.array,
  deliveriesLoading: PropTypes.bool,
  createHandler: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
  recentDeliveries: PropTypes.object,
  removeHandler: PropTypes.func.isRequired,
  updateHandler: PropTypes.func.isRequired,
  selectedHookId: PropTypes.number,
  webhooks: PropTypes.array,
  webhooksLoading: PropTypes.bool,
}

export default ProjectSettingsWebhooksComponent
