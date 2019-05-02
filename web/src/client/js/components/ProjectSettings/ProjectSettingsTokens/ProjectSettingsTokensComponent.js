/* eslint-disable no-trailing-spaces */
import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'
import ProjectSettingsTokenList from './ProjectSettingsTokenList'

const ProjectSettingsTokensComponent = ({ projectId, tokens }) => {
  const [selectedTokenId, setSelectedTokenId] = useState(tokens[0].id || null)
  const [selectedToken, setSelectedToken] = useState(tokens[0] || null)
  function tokenSelectHandler(tokenId) {
    setSelectedToken(tokens.find(token => token.id === tokenId))
    setSelectedTokenId(tokenId)
  }
  return (
    <div className="project-settings__tokens">
      <section>
        <h2>Project Keys</h2>
        <ProjectSettingsTokenList selectedToken={selectedTokenId} tokens={tokens} tokenSelectHandler={tokenSelectHandler} />
      </section>
      <section>
        <h2>Project Endpoints</h2>
        <p>
          Test your project keys with the following endpoints.
          You can select a different key to see results for different types of keys.
          For example, you can test creating a document with a <u>{Constants.PROJECT_ROLE_NAMES[Constants.PROJECT_ROLE_IDS.READER]}</u> key to receive an error.
        </p>
        <p>Looking for the full API? Check out our <a href={Constants.DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">documentation</a>.</p>
        <dl className="project-settings__endpoints">
          <dt className="project-settings__endpoint-name">
            <span className="project-settings__endpoint-method pill pill--green">GET</span> Documents
          </dt>
          <dd className="project-settings__endpoint">
            <pre>
              <code className="code">
                <span className="code__block-comment"># Get the project documents using the selected token</span>
                <span className="code__command">curl</span> -H &quot;Authorization: Bearer <span className="project-settings__endpoint-token">{selectedToken.token}</span>&quot; \<br />
                <span className="project-settings__endpoint-url">{Constants.PRODUCT_API_URL}/projects/{projectId}/documents</span>
              </code>
            </pre>
            <textarea hidden readOnly defaultValue={`curl -H "Authorization: Bearer ${selectedToken.token}" ${Constants.PRODUCT_API_URL}/projects/${projectId}/documents`} />
          </dd>
          <dt className="project-settings__endpoint-name">
            <span className="project-settings__endpoint-method pill pill--orange">POST</span> Documents
          </dt>
          <dd className="project-settings__endpoint">
            <pre>
              <code className="code">
                <span className="code__command">curl</span> -H &quot;Authorization: Bearer <span className="project-settings__endpoint-token">{selectedToken.token}</span>&quot; \<br />
                -d &apos;<span className="code__json">&#123;&quot;name&quot;: &quot;My new document&quot;&#125;</span>&apos; -H &quot;Content-Type: application/json&quot; -X POST \<br />
                <span className="project-settings__endpoint-url">{Constants.PRODUCT_API_URL}/projects/{projectId}/documents</span>
              </code>
            </pre>
            <textarea hidden readOnly defaultValue={`curl -H "Authorization: Bearer ${selectedToken.token}" -d '{"name":"My new document"}' -H "Content-Type: application/json" -X POST ${Constants.PRODUCT_API_URL}/projects/${projectId}/documents`} />
          </dd>
          <dt className="project-settings__endpoint-name">
            <span className="project-settings__endpoint-method pill pill--blue">PUT</span> Documents
          </dt>
          <dd className="project-settings__endpoint">
            <pre>
              <code className="code">
                <span className="code__command">curl</span> -H &quot;Authorization: Bearer <span className="project-settings__endpoint-token">{selectedToken.token}</span>&quot; \<br />
                -d &apos;<span className="code__json">&#123;&quot;name&quot;: &quot;My updated document name&quot;&#125;</span>&apos; -H &quot;Content-Type: application/json&quot; -X PUT \<br />
                <span className="project-settings__endpoint-url">{Constants.PRODUCT_API_URL}/projects/{projectId}/documents</span>
              </code>
            </pre>
            <textarea hidden readOnly defaultValue={`curl -H "Authorization: Bearer ${selectedToken.token}" -d '{"name":"My updated document name"}' -H "Content-Type: application/json" -X PUT ${Constants.PRODUCT_API_URL}/projects/${projectId}/documents`} />
          </dd>
        </dl>
      </section>
    </div>
  )
}

ProjectSettingsTokensComponent.propTypes = {
  projectId: PropTypes.string.isRequired,
  tokens: PropTypes.array.isRequired
}

export default ProjectSettingsTokensComponent
