import React from 'react'
import PropTypes from 'prop-types'

const PanelContent = ({ children, contentKey, contentMap }) => {
  function renderContentMap() {
    // If we're looking at a key (url param) that isn't in our map,
    // return the default content in contentMap
    if (contentMap[contentKey] === undefined) {
      return contentMap.default
    }
    return contentMap[contentKey]
  }
  return (
    <div className="panel__content">
      {renderContentMap()}
      {children}
    </div>
  )
}

PanelContent.propTypes = {
  children: PropTypes.node,
  contentKey: PropTypes.string,
  contentMap: PropTypes.objectOf(PropTypes.node)
}

export default PanelContent
