import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { DocumentIcon, FieldSettingsIcon, OutlineIcon } from 'Components/Icons'
import DocumentInfoContainer from './DocumentInfo/DocumentInfoContainer'
import DocumentOutlineContainer from './DocumentOutline/DocumentOutlineContainer'
import DocumentFieldSettingsContainer from './DocumentFieldSettings/DocumentFieldSettingsContainer'

import './DocumentPanelStyles.scss'

const DocumentPanelComponent = ({ selectedTabIndex, selectTabHandler }) => {
  const panelRef = useRef()
  const tabsRef = useRef()
  const tabFocus = useRef(0)

  const panelTabs = [
    {
      component: <DocumentInfoContainer />,
      label: 'Document info',
      icon: <DocumentIcon />,
      index: 0
    },
    {
      component: <DocumentOutlineContainer />,
      label: 'Document outline',
      icon: <OutlineIcon />,
      index: 1
    },
    {
      component: <DocumentFieldSettingsContainer />,
      label: 'Field settings',
      icon: <FieldSettingsIcon />,
      index: 2
    },
  ]

  useEffect(() => {
    const panel = panelRef.current
    if (panel) {
      panel.classList.add('document-panel--active')
    }
    return () => {
      panel.classList.remove('document-panel--active')
    }
  })

  // Handle left/right key navigation of tab list
  useEffect(() => {
    function keyDownhandler(e) {
      if (e.target.tagName === 'BUTTON' && (e.keyCode === 39 || e.keyCode === 37)) {
        tabsRef.current[tabFocus.current].setAttribute('tabindex', -1)
        if (e.keyCode === 39) {
          tabFocus.current++
          if (tabFocus.current >= tabsRef.current.length) { tabFocus.current = 0 }
        } else if (e.keyCode === 37) {
          tabFocus.current--
          if (tabFocus.current < 0) { tabFocus.current = tabsRef.current.length - 1 }
        }
        tabsRef.current[tabFocus.current].setAttribute('tabindex', 0)
        tabsRef.current[tabFocus.current].focus()
      }
    }

    const panel = panelRef.current
    if (panel) {
      tabsRef.current = panel.querySelectorAll('.document-panel__tab')
      panel.addEventListener('keydown', keyDownhandler, { passive: true })
    }
    return () => {
      panel.removeEventListener('keydown', keyDownhandler, { passive: true })
    }
  })

  return (
    <div className="document-panel" ref={panelRef}>
      <div className="document-panel__tabs" role="tablist" aria-label="Document panel tabs">
        {panelTabs.map((tab, index) => {
          const tabIndex = index === 0 ? 0 : -1
          return (
            <button
              aria-controls={`panel-${tab.index}`}
              aria-label={tab.label}
              aria-selected={selectedTabIndex === tab.index}
              className="document-panel__tab"
              id={`tab-${tab.index + 1}`}
              key={`tab-${tab.index + 1}`}
              onClick={() => {
                selectTabHandler(tab.index)
              }}
              role="tab"
              tabIndex={tabIndex}
              title={tab.label}
            >
              {tab.icon}
            </button>
          )
        })}
      </div>
      {panelTabs.map((panel) => {
        return (
          <div
            id={`panel-${panel.index}`}
            key={`panel-${panel.index}`}
            className="document-panel__tab-panel"
            hidden={selectedTabIndex !== panel.index}
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`tab-${panel.index}`}
          >
            {panel.component}
          </div>
        )
      })}
    </div>
  )
}

DocumentPanelComponent.propTypes = {
  selectedTabIndex: PropTypes.number,
  selectTabHandler: PropTypes.func.isRequired,
}

export default DocumentPanelComponent
