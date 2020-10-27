import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { PRODUCT_NAME } from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'
import dataMapper from 'Libs/dataMapper'

import { createProjectWebhook, removeProjectWebhook, updateProjectWebhook } from 'Actions/webhooks'

import ProjectSettingsWebhooksComponent from './ProjectSettingsWebhooksComponent'

const ProjectSettingsWebhooksContainer = ({
  createProjectWebhook,
  recentDeliveries,
  removeProjectWebhook,
  updateProjectWebhook
}) => {
  const { projectId, settingId } = useParams() // settingId is the webhookId here
  const location = useLocation()
  const formId = 'webhook-form'

  const { data: project } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])

  const { data: webhooks, loading: webhooksLoading } = useDataService(dataMapper.projects.webhooks(projectId), [projectId])
  const { data: deliveries, loading: deliveriesLoading } = useDataService(dataMapper.projects.webhookDeliveries(projectId, settingId), [projectId, settingId])

  if (!webhooks) return null

  const webhooksArray = Object.values(webhooks).map((webhook) => {
    return {
      id: webhook.id,
      url: webhook.url,
      active: webhook.active,
      createdAt: webhook.createdAt
    }
  })
  webhooksArray.sort((a, b) => {
    return a.createdAt < b.createdAt
  })

  function webhookCreateHandler(url) {
    createProjectWebhook(formId, projectId, {
      url: url
    })
  }

  function webhookRemoveHandler(webhookId) {
    removeProjectWebhook(projectId, webhookId)
  }

  function webhookUpdateHandler(webhookId, body) {
    updateProjectWebhook(projectId, webhookId, body)
  }

  return (
    <>
      <Helmet>
        <title>{project.name}: Webhooks –– {PRODUCT_NAME}</title>
      </Helmet>
      <ProjectSettingsWebhooksComponent
        createHandler={webhookCreateHandler}
        deliveries={deliveries && deliveries.length ? deliveries : []}
        deliveriesLoading={deliveriesLoading}
        formId={formId}
        project={project}
        recentDeliveries={recentDeliveries[projectId]}
        removeHandler={webhookRemoveHandler}
        updateHandler={webhookUpdateHandler}
        selectedHookId={Number(settingId)}
        webhooks={webhooksArray}
        webhooksLoading={webhooksLoading}
      />
    </>
  )
}

ProjectSettingsWebhooksContainer.propTypes = {
  createProjectWebhook: PropTypes.func.isRequired,
  recentDeliveries: PropTypes.object,
  removeProjectWebhook: PropTypes.func.isRequired,
  updateProjectWebhook: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    recentDeliveries: state.projectWebhooks.recentDeliveriesByProjectId,
  }
}

const mapDispatchToProps = { createProjectWebhook, removeProjectWebhook, updateProjectWebhook }

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSettingsWebhooksContainer)
