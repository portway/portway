import React from 'react'
import PropTypes from 'prop-types'

const DocumentMenuGroup = ({ children, title }) => {
  console.log(children)
  return (
    <div className="document-menu__group">
      {title &&
      <h2 className="document-menu__group-name">{title}</h2>
      }
      <ul className="document-menu__list">
        {children.length && children.map((child, key) => {
          return <li className="document-menu__list-item" key={`group-${key}`}>{child}</li>
        })}
        {children.type &&
        <li className="document-menu__list-item">{children}</li>
        }
      </ul>
    </div>
  )
}

DocumentMenuGroup.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
}

export default DocumentMenuGroup
