import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import cuid from 'cuid'

import { CaretIcon, InfoIcon } from 'Components/Icons'

const DocumentPanelItem = ({ children, expanded, info, label }) => {
  // For the optional info buttons
  const infoId = useRef(cuid.slug())
  const [infoExpanded, setInfoExpanded] = useState(false)

  // For the toggling of panel items
  const panelId = useRef(cuid.slug())
  const [isExpanded, setIsExpanded] = useState(expanded)

  const panelItemClasses = cx({
    'document-panel__item': true,
    'document-panel__item--expanded': isExpanded,
  })

  const panelContentClasses = cx({
    'document-panel__content': true,
    'document-panel__content--expanded': isExpanded,
  })

  return (
    <div className={panelItemClasses}>
      <div className="document-panel__header">
        <button
          aria-controls={`panel-${panelId.current}`}
          aria-expanded={isExpanded}
          aria-haspopup="true"
          aria-label="Toggle panel"
          className="document-panel__title"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CaretIcon />
          <h2 className="document-panel__label">
            {label}
          </h2>
          {info &&
            <div
              aria-controls={`document-info-${infoId.current}`}
              aria-expanded={infoExpanded}
              aria-haspopup="true"
              aria-label="More information"
              className="btn btn--blank btn--with-circular-icon"
              onKeyPress={(e) => {
                e.stopPropagation()
                setInfoExpanded(!infoExpanded)
              }}
              onClick={(e) => {
                e.stopPropagation()
                setInfoExpanded(!infoExpanded)
              }}
              role="button"
              tabIndex={0}
              title="More information"
            >
              <InfoIcon width="24" height="24" />
            </div>
          }
        </button>
        {info && infoExpanded &&
        <div id={`document-info-${infoId.current}`} className="document-panel__info">
          {info}
        </div>
        }
      </div>
      <div id={`panel-${panelId.current}`} className={panelContentClasses}>
        {children}
      </div>
    </div>
  )
}

DocumentPanelItem.propTypes = {
  children: PropTypes.node,
  expanded: PropTypes.bool,
  info: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  label: PropTypes.string.isRequired,
}

export default DocumentPanelItem
