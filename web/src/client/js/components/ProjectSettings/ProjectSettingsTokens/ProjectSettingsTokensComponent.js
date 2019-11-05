/* eslint-disable no-trailing-spaces */
import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import {
  DOCUMENTATION_URL,
  PATH_PROJECT,
  PROJECT_ROLE_NAMES,
  PROJECT_ROLE_IDS,
  PRODUCT_API_URL,
} from 'Shared/constants'
import { CaretIcon } from 'Components/Icons'
import ClipboardComponent from 'Components/Clipboard/ClipboardComponent'
import ProjectSettingsTokenList from './ProjectSettingsTokenList'
import ProjectSettingsCreateToken from './ProjectSettingsCreateToken'

import './_ProjectSettingsTokens.scss'

const ProjectSettingsTokensComponent = ({
  createHandler, createMode, projectId, removeHandler, setCreateMode, tokens
}) => {
  const [selectedTokenId, setSelectedTokenId] = useState(tokens[0] ? tokens[0].id : null)
  const [selectedToken, setSelectedToken] = useState(tokens[0] || { token: '<TOKEN>' })
  function tokenSelectHandler(tokenId) {
    setSelectedToken(tokens.find(token => token.id === tokenId))
    setSelectedTokenId(tokenId)
  }
  function createModeHandler() {
    setCreateMode(true)
  }
  function cancelCreateModeHandler() {
    setCreateMode(false)
  }
  // Refs for copying endpoints
  const getEndpointRef = useRef()
  const postEndpointRef = useRef()
  const putEndpointRef = useRef()
  return (
    <div className="project-settings__tokens">
      <Link to={`${PATH_PROJECT}/${projectId}`} className="link link--back"><CaretIcon /> Back to Project</Link>
      <section>
        <header className="header header--with-button">
          <h2>Project Keys</h2>
          <button className="btn" disabled={createMode} onClick={createModeHandler}>Add project key</button>
        </header>
        <ProjectSettingsTokenList
          selectedToken={selectedTokenId}
          tokens={tokens}
          tokenRemoveHandler={removeHandler}
          tokenSelectHandler={tokenSelectHandler} />
      </section>
      {createMode &&
      <section>
        <h3>Add a new project key</h3>
        <ProjectSettingsCreateToken
          projectId={projectId}
          cancelHandler={cancelCreateModeHandler}
          createHandler={createHandler} />
      </section>
      }
      <section>
        <h2>Project Endpoints</h2>
        <p>
          Test your project keys with the following endpoints.
          You can select a different key to see results for different types of keys.
          For example, you can test creating a document with a <u>{PROJECT_ROLE_NAMES[PROJECT_ROLE_IDS.READER]}</u> key to receive an error.
        </p>
        <p>Looking for the full API? Check out our <a href={DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">documentation</a>.</p>
        <dl className="project-settings__endpoints">
          <dt className="project-settings__endpoint-name">
            <span className="project-settings__endpoint-method pill pill--green">GET</span>
            <span className="project-settings__endpoint-resource">Documents</span>
            <ClipboardComponent copyRef={getEndpointRef} />
          </dt>
          <dd className="project-settings__endpoint">
            <pre>
              <code className="code">
                <span className="code__block-comment"># Get the project documents using the selected token</span>
                <span className="code__command">curl</span> -H &quot;Authorization: Bearer <span className="project-settings__endpoint-token">{selectedToken.token}</span>&quot; \<br />
                <span className="project-settings__endpoint-url">{PRODUCT_API_URL}/projects/{projectId}/documents</span>
              </code>
            </pre>
            <textarea
              ref={getEndpointRef}
              aria-hidden={true}
              className="visually-hidden"
              readOnly
              value={`curl -H "Authorization: Bearer ${selectedToken.token}" ${PRODUCT_API_URL}/projects/${projectId}/documents`}
            />
          </dd>
          <dt className="project-settings__endpoint-name">
            <span className="project-settings__endpoint-method pill pill--orange">POST</span>
            <span className="project-settings__endpoint-resource">Documents</span>
            <ClipboardComponent copyRef={postEndpointRef} />
          </dt>
          <dd className="project-settings__endpoint">
            <pre>
              <code className="code">
                <span className="code__command">curl</span> -H &quot;Authorization: Bearer <span className="project-settings__endpoint-token">{selectedToken.token}</span>&quot; \<br />
                -d &apos;<span className="code__json">&#123;&quot;name&quot;: &quot;My new document&quot;&#125;</span>&apos; -H &quot;Content-Type: application/json&quot; -X POST \<br />
                <span className="project-settings__endpoint-url">{PRODUCT_API_URL}/projects/{projectId}/documents</span>
              </code>
            </pre>
            <textarea
              ref={postEndpointRef}
              aria-hidden={true}
              className="visually-hidden"
              readOnly
              value={`curl -H "Authorization: Bearer ${selectedToken.token}" -d '{"name":"My new document"}' -H "Content-Type: application/json" -X POST ${PRODUCT_API_URL}/projects/${projectId}/documents`}
            />
          </dd>
          <dt className="project-settings__endpoint-name">
            <span className="project-settings__endpoint-method pill pill--blue">PUT</span>
            <span className="project-settings__endpoint-resource">Documents</span>
            <ClipboardComponent copyRef={putEndpointRef} />
          </dt>
          <dd className="project-settings__endpoint">
            <pre>
              <code className="code">
                <span className="code__command">curl</span> -H &quot;Authorization: Bearer <span className="project-settings__endpoint-token">{selectedToken.token}</span>&quot; \<br />
                -d &apos;<span className="code__json">&#123;&quot;name&quot;: &quot;My updated document name&quot;&#125;</span>&apos; -H &quot;Content-Type: application/json&quot; -X PUT \<br />
                <span className="project-settings__endpoint-url">{PRODUCT_API_URL}/projects/{projectId}/documents/&lt;DOCUMENT_ID&gt;</span>
              </code>
            </pre>
            <textarea
              ref={putEndpointRef}
              aria-hidden={true}
              className="visually-hidden"
              readOnly
              value={`curl -H "Authorization: Bearer ${selectedToken.token}" -d '{"name":"My updated document name"}' -H "Content-Type: application/json" -X PUT ${PRODUCT_API_URL}/projects/${projectId}/documents/<DOCUMENT_ID>`}
            />
          </dd>
        </dl>
      </section>
    </div>
  )
}

ProjectSettingsTokensComponent.propTypes = {
  createHandler: PropTypes.func.isRequired,
  createMode: PropTypes.bool.isRequired,
  projectId: PropTypes.number.isRequired,
  setCreateMode: PropTypes.func.isRequired,
  removeHandler: PropTypes.func.isRequired,
  tokens: PropTypes.array.isRequired
}

export default ProjectSettingsTokensComponent
